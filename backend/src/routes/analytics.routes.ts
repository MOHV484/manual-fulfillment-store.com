import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const analyticsRouter = Router();
analyticsRouter.use(requireAuth, requireRole("super_admin"));

interface OrderRow {
  status: string;
  assigned_admin_id: string | null;
  created_at: string;
  updated_at: string;
  users: { name: string } | { name: string }[] | null;
}

// GET /api/analytics/summary — daily totals + average handling time per
// moderator. Computed in-process from `orders` (order volume here is small
// enough that this stays fast without a dedicated DB view).
analyticsRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "status, assigned_admin_id, created_at, updated_at, users!orders_assigned_admin_id_fkey(name)"
      )
      .gte("created_at", startOfDay.toISOString());

    if (error) throw new AppError(error.message, 500);

    const todayOrders = (data ?? []) as OrderRow[];
    const completedToday = todayOrders.filter((o) => o.status === "completed").length;
    const rejectedToday = todayOrders.filter((o) => o.status === "rejected").length;

    const perModerator = new Map<string, { name: string; count: number; totalMs: number }>();
    for (const order of todayOrders) {
      if (!order.assigned_admin_id) continue;
      if (order.status !== "completed" && order.status !== "rejected") continue;

      const nameField = Array.isArray(order.users) ? order.users[0]?.name : order.users?.name;
      const ms = new Date(order.updated_at).getTime() - new Date(order.created_at).getTime();
      const entry = perModerator.get(order.assigned_admin_id) ?? {
        name: nameField ?? "—",
        count: 0,
        totalMs: 0,
      };
      entry.count += 1;
      entry.totalMs += ms;
      perModerator.set(order.assigned_admin_id, entry);
    }

    const moderators = Array.from(perModerator.entries()).map(([id, v]) => ({
      id,
      name: v.name,
      ordersHandled: v.count,
      avgHandlingMinutes: Math.round(v.totalMs / v.count / 60000),
    }));

    res.json({
      completedToday,
      rejectedToday,
      totalToday: todayOrders.length,
      moderators,
    });
  })
);
