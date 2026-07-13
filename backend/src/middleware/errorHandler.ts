import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

/**
 * Throw `new AppError("...", 404)` anywhere in a route/controller and it
 * will be caught here with the right status code and a clean JSON body —
 * instead of leaking a stack trace to the client.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

// Express recognizes this as an error-handling middleware purely by its
// 4-argument signature — the unused params must stay (prefixed with _
// so TypeScript's noUnusedParameters rule doesn't flag them).
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      message: env.isProduction
        ? "Internal server error"
        : err instanceof Error
        ? err.message
        : "Internal server error",
    },
  });
}
