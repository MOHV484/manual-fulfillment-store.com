import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { asyncHandler } from "../utils/asyncHandler";

export const healthRouter = Router();

// Simple liveness check — the process is up.
healthRouter.get("/", (req, res) => {
  res.json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Readiness check — the process is up AND can reach the database.
// Useful for deployment platforms (Render/Railway) health checks.
healthRouter.get(
  "/db",
  asyncHandler(async (req, res) => {
    const { error } = await supabaseAdmin
      .from("users")
      .select("id", { count: "exact", head: true });

    if (error) {
      res.status(503).json({ status: "error", detail: error.message });
      return;
    }

    res.json({ status: "ok", database: "reachable" });
  })
);
