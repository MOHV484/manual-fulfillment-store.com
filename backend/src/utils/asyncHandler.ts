import { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wrap an async route handler so a rejected promise is forwarded to
 * Express's error middleware instead of crashing the process or hanging
 * the request. Usage: router.get("/x", asyncHandler(async (req, res) => {...}))
 */
export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
