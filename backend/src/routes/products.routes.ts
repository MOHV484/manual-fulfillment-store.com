import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const productsRouter = Router();

// GET /api/products — public list of available products (clients browse here)
productsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const category = req.query.category as string | undefined;

    let query = supabaseAdmin
      .from("products")
      .select("id, title, description, category, price, is_available")
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500);

    res.json({ products: data });
  })
);

// GET /api/products/:id — single product details
productsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, title, description, category, price, is_available")
      .eq("id", req.params.id)
      .single();

    if (error || !data) throw new AppError("Product not found", 404);

    res.json({ product: data });
  })
);

// POST /api/products — create a new product (super_admin only)
productsRouter.post(
  "/",
  requireAuth,
  requireRole("super_admin"),
  asyncHandler(async (req, res) => {
    const { title, description, category, price, is_available } = req.body;

    if (!title || !category || price === undefined) {
      throw new AppError("title, category and price are required", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        title,
        description: description ?? null,
        category,
        price,
        is_available: is_available ?? true,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    res.status(201).json({ product: data });
  })
);

// PATCH /api/products/:id — update price/availability/etc (super_admin only)
productsRouter.patch(
  "/:id",
  requireAuth,
  requireRole("super_admin"),
  asyncHandler(async (req, res) => {
    const { title, description, category, price, is_available } = req.body;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price }),
        ...(is_available !== undefined && { is_available }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) throw new AppError("Product not found", 404);

    res.json({ product: data });
  })
);
