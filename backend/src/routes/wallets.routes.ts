import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const walletsRouter = Router();
walletsRouter.use(requireAuth);

// GET /api/wallets/me — the logged-in client's own wallet balance
walletsRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("wallets")
      .select("balance, updated_at")
      .eq("user_id", req.user!.id)
      .single();

    if (error || !data) throw new AppError("Wallet not found", 404);
    res.json({ wallet: data });
  })
);

// PATCH /api/wallets/:userId — Super Admin manually adjusts a client's
// balance (e.g. a refund for a rejected order). Always written to
// audit_logs — balance changes are exactly what the audit trail exists to
// catch.
walletsRouter.patch(
  "/:userId",
  requireRole("super_admin"),
  asyncHandler(async (req, res) => {
    const { amount, reason } = req.body as { amount?: number; reason?: string };
    if (typeof amount !== "number" || !reason) {
      throw new AppError("amount (رقم) و reason مطلوبين", 400);
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("wallets")
      .select("balance")
      .eq("user_id", req.params.userId)
      .single();

    if (fetchError || !existing) throw new AppError("Wallet not found", 404);

    const newBalance = Number(existing.balance) + amount;
    if (newBalance < 0) {
      throw new AppError("الرصيد الناتج لا يمكن أن يكون بالسالب", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("wallets")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", req.params.userId)
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    await supabaseAdmin.from("audit_logs").insert({
      admin_id: req.user!.id,
      action_type: "balance_modify",
      order_id: null,
      previous_value: String(existing.balance),
      new_value: `${newBalance} (${reason})`,
      ip_address: req.ip,
    });

    res.json({ wallet: data });
  })
);
