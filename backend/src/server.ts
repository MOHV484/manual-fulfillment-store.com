import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { healthRouter } from "./routes/health.routes";
import { productsRouter } from "./routes/products.routes";
import { ordersRouter } from "./routes/orders.routes";
import { authRouter } from "./routes/auth.routes";
import { uploadsRouter } from "./routes/uploads.routes";
import { walletsRouter } from "./routes/wallets.routes";
import { auditRouter } from "./routes/audit.routes";
import { adminUsersRouter } from "./routes/adminUsers.routes";
import { analyticsRouter } from "./routes/analytics.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimit";

const app = express();

// Trust the first proxy (required for accurate req.ip behind Render / Nginx)
app.set("trust proxy", 1);

// --- Global middleware ---
app.use(helmet());
app.use(
  cors({
    origin: [env.clientOrigin, env.adminOrigin],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Keep basic request logging on in production too — needed to diagnose
// issues from the Render Logs tab.
app.use(morgan(env.isProduction ? "combined" : "dev"));

// Global rate limit — tighter per-action limits are applied on individual routes
app.use(apiLimiter);

// --- Routes ---
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/audit-logs", auditRouter);
app.use("/api/admin", adminUsersRouter);
app.use("/api/analytics", analyticsRouter);

// --- 404 + error handling (must be registered last) ---
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port} [${env.nodeEnv}]`);
});
