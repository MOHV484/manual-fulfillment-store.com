import { randomUUID } from "crypto";
import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { detectImageMimeType } from "../utils/fileValidation";

export const uploadsRouter = Router();

// Keep the file in memory just long enough to validate + forward it to
// Supabase Storage — it is never written to disk on our server.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/uploads/receipt — client uploads a payment receipt image.
// Returns a private Storage *path*, never a public URL — the bucket is
// private, and the path is only ever resolved to a short-lived signed URL
// for the order's owner or an admin (see GET /api/orders/:id/receipt-url).
uploadsRouter.post(
  "/receipt",
  requireAuth,
  upload.single("receipt"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError("لازم ترفع صورة إيصال الدفع", 400);
    }

    // Trust the real bytes, not the extension or the client's Content-Type.
    const realMimeType = detectImageMimeType(req.file.buffer);
    if (!realMimeType) {
      throw new AppError("صيغة الملف غير مسموحة. المسموح فقط JPG أو PNG", 415);
    }

    const extension = realMimeType === "image/png" ? "png" : "jpg";
    // Random, unguessable filename under the uploader's own folder — never
    // trust or store the client-supplied original filename.
    const path = `${req.user!.id}/${randomUUID()}.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from(env.receiptsBucket)
      .upload(path, req.file.buffer, {
        contentType: realMimeType,
        upsert: false,
      });

    if (error) throw new AppError(`فشل رفع الملف: ${error.message}`, 500);

    res.status(201).json({ receipt_path: path });
  })
);
