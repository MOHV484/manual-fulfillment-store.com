import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

// GET /api/auth/me — the full profile row for the logged-in user (role,
// status, phone, etc). The frontend calls this right after a session
// appears so it knows whether to show the client UI or the admin dashboard.
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, phone, role, status, created_at")
      .eq("id", req.user!.id)
      .single();

    if (error || !data) throw new AppError("User profile not found", 404);

    res.json({ user: data });
  })
);
