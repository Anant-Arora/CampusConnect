import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

function sanitizeUser(user: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

function signToken(user: { id: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new HttpError(500, "Server misconfigured");
  return jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response) {
  const { fullName, email, phone, password, college, degree, skills } = req.body ?? {};

  if (!fullName || !email || !password || !college || !degree || !Array.isArray(skills)) {
    throw new HttpError(400, "Missing required fields");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone: phone || null,
      passwordHash,
      college,
      degree,
      skills,
    },
  });

  const token = signToken(user);
  return res.json({
    success: true,
    data: { token, user: sanitizeUser(user) },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) throw new HttpError(400, "Missing email or password");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  const token = signToken(user);
  return res.json({
    success: true,
    data: { token, user: sanitizeUser(user) },
  });
}

export async function me(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new HttpError(404, "User not found");

  return res.json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
}

