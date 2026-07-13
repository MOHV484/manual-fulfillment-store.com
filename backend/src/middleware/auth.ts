import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "./errorHandler";
import { UserRole } from "../types";
import { asyncHandler } from "../utils/asyncHandler";

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
}

/**
 * Verifies the Supabase-issued JWT sent by the frontend in the
 * `Authorization: Bearer <token>` header, then loads the matching row
 * from our own `users` table (source of truth for role/status) and
 * attaches it to `req.user`.
 */
export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header", 401);
    }

    const token = header.slice("Bearer ".length);

    let payload: SupabaseJwtPayload;
    try {
      payload = jwt.verify(token, env.supabaseJwtSecret) as SupabaseJwtPayload;
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }

    const { data: userRow, error } = await supabaseAdmin
      .from("users")
      .select("id, role, status")
      .eq("id", payload.sub)
      .single();

    if (error || !userRow) {
      throw new AppError("User not found", 401);
    }

    if (userRow.status === "suspended") {
      throw new AppError("Account suspended", 403);
    }

    req.user = {
      id: userRow.id,
      email: payload.email ?? "",
      role: userRow.role as UserRole,
    };

    next();
  }
);

/**
 * Restrict a route to one or more roles. Must be used AFTER requireAuth.
 * Usage: router.post("/x", requireAuth, requireRole("moderator", "super_admin"), handler)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError("You don't have permission to do this", 403);
    }
    next();
  };
}
