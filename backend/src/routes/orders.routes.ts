import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const ordersRouter = Router();

// All order routes require a logged-in user.
ordersRouter.use(requireAuth);

// POST /api/orders — client submits a new order (status starts as "pending")
ordersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { product_id, player_id, account_details, receipt_url } = req.body;

    if (!product_id || !receipt_url) {
      throw new AppError("product_id and receipt_url are required", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: req.user!.id,
        product_id,
        player_id: player_id ?? null,
        account_details: account_details ?? null,
        receipt_url,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    res.status(201).json({ order: data });
  })
);

// GET /api/orders/my — the logged-in client's own orders
ordersRouter.get(
  "/my",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, products(title, category, price)")
      .eq("user_id", req.user!.id)
      .order("created_at", { ascending: false });

    if (error) throw new AppError(error.message, 500);

    res.json({ orders: data });
  })
);

// GET /api/orders — moderators/admins see the full queue (optionally filtered by status)
ordersRouter.get(
  "/",
  requireRole("moderator", "super_admin"),
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;

    let query = supabaseAdmin
      .from("orders")
      .select("*, products(title, category, price), users!orders_user_id_fkey(name, phone)")
      .order("created_at", { ascending: true });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500);

    res.json({ orders: data });
  })
);

// POST /api/orders/:id/claim — a moderator locks the order for themself.
// This single conditional UPDATE is the whole "race condition fix": it only
// succeeds if the order is still "pending". If another moderator claimed it
// a moment earlier, zero rows match and we return a clear conflict error.
ordersRouter.post(
  "/:id/claim",
  requireRole("moderator", "super_admin"),
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "processing",
        assigned_admin_id: req.user!.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .eq("status", "pending") // <-- the lock: only claim if still pending
      .select()
      .single();

    if (error || !data) {
      throw new AppError(
        "الطلب ده اتحجز بالفعل من مشرف تاني أو مش موجود",
        409
      );
    }

    await supabaseAdmin.from("audit_logs").insert({
      admin_id: req.user!.id,
      action_type: "order_claim",
      order_id: data.id,
      previous_value: "pending",
      new_value: "processing",
      ip_address: req.ip,
    });

    res.json({ order: data });
  })
);

// POST /api/orders/:id/complete — the assigned moderator confirms fulfillment
ordersRouter.post(
  "/:id/complete",
  requireRole("moderator", "super_admin"),
  asyncHandler(async (req, res) => {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, status, assigned_admin_id")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !existing) throw new AppError("Order not found", 404);

    const isOwner = existing.assigned_admin_id === req.user!.id;
    if (!isOwner && req.user!.role !== "super_admin") {
      throw new AppError("الطلب ده محجوز لمشرف تاني", 403);
    }
    if (existing.status !== "processing") {
      throw new AppError("الطلب لازم يكون قيد المعالجة الأول", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    await supabaseAdmin.from("audit_logs").insert({
      admin_id: req.user!.id,
      action_type: "order_approve",
      order_id: data.id,
      previous_value: "processing",
      new_value: "completed",
      ip_address: req.ip,
    });

    res.json({ order: data });
  })
);

// POST /api/orders/:id/reject — the assigned moderator rejects with a reason
ordersRouter.post(
  "/:id/reject",
  requireRole("moderator", "super_admin"),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    if (!reason) throw new AppError("rejection reason is required", 400);

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, status, assigned_admin_id")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !existing) throw new AppError("Order not found", 404);

    const isOwner = existing.assigned_admin_id === req.user!.id;
    if (!isOwner && req.user!.role !== "super_admin") {
      throw new AppError("الطلب ده محجوز لمشرف تاني", 403);
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "rejected",
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    await supabaseAdmin.from("audit_logs").insert({
      admin_id: req.user!.id,
      action_type: "order_reject",
      order_id: data.id,
      previous_value: existing.status,
      new_value: "rejected",
      ip_address: req.ip,
    });

    res.json({ order: data });
  })
);
