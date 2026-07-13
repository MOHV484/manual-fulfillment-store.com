import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { healthRouter } from "./routes/health.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

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

if (!env.isProduction) {
  app.use(morgan("dev"));
}

// --- Routes ---
// More routers (auth, orders, products, admin, ...) get mounted here in
// the upcoming steps, each under its own path, e.g.:
//   app.use("/api/auth", authRouter);
//   app.use("/api/orders", ordersRouter);
app.use("/api/health", healthRouter);

// --- 404 + error handling (must be registered last) ---
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port} [${env.nodeEnv}]`);
});
