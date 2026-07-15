import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const adminUsersRouter = Router();
adminUsersRouter.use(requireAuth, requireRole("super_admin"));

// GET /api/admin/moderators — list every staff account
adminUsersRouter.get(
  "/moderators",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, phone, role, status, created_at")
      .in("role", ["moderator", "super_admin"])
      .order("created_at", { ascending: false });

    if (error) throw new AppError(error.message, 500);
    res.json({ moderators: data });
  })
);

// POST /api/admin/moderators — create a brand-new moderator account.
// Uses the Supabase Admin API to create the auth user directly (staff
// accounts don't need email confirmation), then promotes the row our
// on_auth_user_created trigger just inserted from 'client' to 'moderator'.
adminUsersRouter.post(
  "/moderators",
  asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      throw new AppError("name, email, phone و password مطلوبين", 400);
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone },
    });

    if (createError || !created.user) {
      throw new AppError(createError?.message ?? "فشل إنشاء الحساب", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role: "moderator" })
      .eq("id", created.user.id)
      .select("id, name, email, phone, role, status")
      .single();

    if (error) throw new AppError(error.message, 400);

    res.status(201).json({ moderator: data });
  })
);

// PATCH /api/admin/moderators/:id/status — suspend or re-activate a
// moderator account. Super Admin accounts can't be touched from here.
adminUsersRouter.patch(
  "/moderators/:id/status",
  asyncHandler(async (req, res) => {
    const { status } = req.body as { status?: "active" | "suspended" };
    if (status !== "active" && status !== "suspended") {
      throw new AppError("status لازم يكون active أو suspended", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ status })
      .eq("id", req.params.id)
      .neq("role", "super_admin")
      .select("id, name, email, role, status")
      .single();

    if (error || !data) throw new AppError("تعذر تحديث الحالة", 400);

    res.json({ moderator: data });
  })
);
