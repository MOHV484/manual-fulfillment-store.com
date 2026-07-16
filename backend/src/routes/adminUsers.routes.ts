import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { sensitiveActionLimiter } from "../middleware/rateLimit";

export const adminUsersRouter = Router();
adminUsersRouter.use(requireAuth, requireRole("super_admin"));

// Strong password: 10+ chars, at least one uppercase, lowercase, and digit
const strongPassword = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit");

const createModeratorSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  password: strongPassword,
});

const updateModeratorSchema = z.object({
  status: z.enum(["active", "suspended"]),
});

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
adminUsersRouter.post(
  "/moderators",
  sensitiveActionLimiter,
  validateBody(createModeratorSchema),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone },
    });

    if (createError || !created.user) {
      throw new AppError(createError?.message ?? "فشل إنشاء الحساب", 400);
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ role: "moderator", name, phone })
      .eq("id", created.user.id);

    if (updateError) throw new AppError(updateError.message, 500);

    const { data: newMod } = await supabaseAdmin
      .from("users")
      .select("id, name, email, phone, role, status, created_at")
      .eq("id", created.user.id)
      .single();

    res.status(201).json({ moderator: newMod });
  })
);

// PATCH /api/admin/moderators/:id — toggle active/suspended status
adminUsersRouter.patch(
  "/moderators/:id",
  sensitiveActionLimiter,
  validateBody(updateModeratorSchema),
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ status })
      .eq("id", req.params.id)
      .in("role", ["moderator"])
      .select("id, name, email, role, status")
      .single();

    if (error || !data) throw new AppError("Moderator not found", 404);

    res.json({ moderator: data });
  })
);
