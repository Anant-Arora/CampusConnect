import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

function sanitizeUser(user: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function searchUsers(req: Request, res: Response) {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const skillsParam = typeof req.query.skills === "string" ? req.query.skills.trim() : "";
  const skills = skillsParam ? skillsParam.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const where: any = {};

  const or: any[] = [];
  if (q) {
    or.push({ fullName: { contains: q, mode: "insensitive" } });
    or.push({ college: { contains: q, mode: "insensitive" } });
    or.push({ skills: { has: q } });
  }

  if (skills.length > 0) {
    where.skills = { hasSome: skills };
  }

  if (or.length > 0) where.OR = or;

  const users = await prisma.user.findMany({
    where,
    take: 25,
    select: {
      id: true,
      fullName: true,
      college: true,
      degree: true,
      skills: true,
      rating: true,
      isOnline: true,
      avatarUrl: true,
      location: true,
    },
    orderBy: { rating: "desc" },
  });

  return res.json({ success: true, data: { users } });
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, "User not found");
  return res.json({ success: true, data: { user: sanitizeUser(user) } });
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!req.user) throw new HttpError(401, "Unauthorized");
  if (req.user.id !== id) throw new HttpError(403, "Forbidden");

  const {
    fullName,
    bio,
    location,
    skills,
    college,
    degree,
    avatarUrl,
    phone,
  } = req.body ?? {};

  const updated = await prisma.user.update({
    where: { id },
    data: {
      fullName: typeof fullName === "string" ? fullName : undefined,
      bio: typeof bio === "string" ? bio : bio === null ? null : undefined,
      location: typeof location === "string" ? location : location === null ? null : undefined,
      skills: Array.isArray(skills) ? skills : undefined,
      college: typeof college === "string" ? college : undefined,
      degree: typeof degree === "string" ? degree : undefined,
      avatarUrl: typeof avatarUrl === "string" ? avatarUrl : avatarUrl === null ? null : undefined,
      phone: typeof phone === "string" ? phone : phone === null ? null : undefined,
    },
  });

  return res.json({ success: true, data: { user: sanitizeUser(updated) } });
}

export async function setOnline(req: Request, res: Response) {
  const { id } = req.params;
  if (!req.user) throw new HttpError(401, "Unauthorized");
  if (req.user.id !== id) throw new HttpError(403, "Forbidden");

  const { isOnline } = req.body ?? {};
  if (typeof isOnline !== "boolean") throw new HttpError(400, "isOnline must be boolean");

  const user = await prisma.user.update({
    where: { id },
    data: { isOnline },
    select: {
      id: true,
      isOnline: true,
    },
  });

  return res.json({ success: true, data: { user } });
}

