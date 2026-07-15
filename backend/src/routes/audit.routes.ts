import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const auditRouter = Router();
auditRouter.use(requireAuth, requireRole("super_admin"));

// GET /api/audit-logs — Super Admin only: full immutable audit trail.
auditRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 100), 200);

    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*, users!audit_logs_admin_id_fkey(name, email)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new AppError(error.message, 500);

    res.json({ logs: data });
  })
);
