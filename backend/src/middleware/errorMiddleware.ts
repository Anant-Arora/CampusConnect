import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const statusCode =
    typeof err === "object" && err && "statusCode" in err && typeof (err as any).statusCode === "number"
      ? (err as any).statusCode
      : 500;

  const message =
    typeof err === "object" && err && "message" in err && typeof (err as any).message === "string"
      ? (err as any).message
      : "Internal server error";

  return res.status(statusCode).json({ success: false, error: message });
}

