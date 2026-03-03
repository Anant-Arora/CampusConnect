import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

export async function listNotifications(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    }),
  ]);

  return res.json({ success: true, data: { notifications, unreadCount } });
}

export async function markAllRead(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  await prisma.notification.updateMany({
    where: { userId: req.user.id, isRead: false },
    data: { isRead: true },
  });

  return res.json({ success: true, data: {} });
}

