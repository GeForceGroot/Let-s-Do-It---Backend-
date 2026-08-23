import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(
  error: Error & { statusCode?: number; name?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  void _next;
  console.error(error);
  if (error.name === "CastError") {
    res
      .status(400)
      .json({ success: false, message: "Invalid resource identifier" });
    return;
  }
  res.status(error.statusCode ?? 500).json({
    success: false,
    message: error.statusCode ? error.message : "Internal server error",
  });
}
