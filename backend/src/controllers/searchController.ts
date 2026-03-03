import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

export async function globalSearch(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (q.length < 2) throw new HttpError(400, "Query too short");

  const [users, posts, opportunities] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { college: { contains: q, mode: "insensitive" } },
          { skills: { has: q } },
        ],
      },
      take: 10,
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
    }),
    prisma.post.findMany({
      where: { content: { contains: q, mode: "insensitive" } },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, fullName: true, college: true, avatarUrl: true } } },
    }),
    prisma.opportunity.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { company: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, fullName: true, college: true, avatarUrl: true } } },
    }),
  ]);

  return res.json({ success: true, data: { users, posts, opportunities } });
}

