import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { sensitiveActionLimiter } from "../middleware/rateLimit";

export const ordersRouter = Router();

// All order routes require a logged-in user.
ordersRouter.use(requireAuth);

const createOrderSchema = z.object({
  product_id: z.string().uuid(),
  receipt_path: z.string().min(1),
  player_id: z.string().max(100).optional(),
  account_details: z.string().max(500).optional(),
});

const rejectOrderSchema = z.object({
  reason: z.string().min(1).max(500),
});

// POST /api/orders — client submits a new order (status starts as "pending").
ordersRouter.post(
  "/",
  sensitiveActionLimiter,
  validateBody(createOrderSchema),
  asyncHandler(async (req, res) => {
    const { product_id, player_id, account_details, receipt_path } = req.body;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: req.user!.id,
        product_id,
        player_id: player_id ?? null,
        account_details: account_details ?? null,
        receipt_url: receipt_path,
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

// GET /api/orders/:id/receipt-url — a short-lived signed URL to view the receipt image.
ordersRouter.get(
  "/:id/receipt-url",
  asyncHandler(async (req, res) => {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, receipt_url")
      .eq("id", req.params.id)
      .single();

    if (error || !order) throw new AppError("Order not found", 404);

    const isOwner = order.user_id === req.user!.id;
    const isStaff = req.user!.role === "moderator" || req.user!.role === "super_admin";
    if (!isOwner && !isStaff) {
      throw new AppError("لا تملك صلاحية مشاهدة هذا الإيصال", 403);
    }

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from(env.receiptsBucket)
      .createSignedUrl(order.receipt_url, env.receiptSignedUrlTtl);

    if (signError || !signed) throw new AppError("فشل إنشاء رابط المعاينة", 500);

    res.json({ url: signed.signedUrl, expiresInSeconds: env.receiptSignedUrlTtl });
  })
);

// POST /api/orders/:id/claim — a moderator locks the order for themself.
ordersRouter.post(
  "/:id/claim",
  requireRole("moderator", "super_admin"),
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        assigned_admin_id: req.user!.id,
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .eq("status", "pending")
      .select()
      .single();

    if (error || !data) throw new AppError("الطلب مش موجود أو اتحجز بالفعل", 409);

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

// POST /api/orders/:id/fulfill — mark the order as fulfilled with delivery details
ordersRouter.post(
  "/:id/fulfill",
  requireRole("moderator", "super_admin"),
  asyncHandler(async (req, res) => {
    const { delivery_details } = req.body;

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
        status: "fulfilled",
        delivery_details: delivery_details ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    await supabaseAdmin.from("audit_logs").insert({
      admin_id: req.user!.id,
      action_type: "order_fulfill",
      order_id: data.id,
      previous_value: existing.status,
      new_value: "fulfilled",
      ip_address: req.ip,
    });

    res.json({ order: data });
  })
);

// POST /api/orders/:id/reject — the assigned moderator rejects with a reason
ordersRouter.post(
  "/:id/reject",
  requireRole("moderator", "super_admin"),
  sensitiveActionLimiter,
  validateBody(rejectOrderSchema),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

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
