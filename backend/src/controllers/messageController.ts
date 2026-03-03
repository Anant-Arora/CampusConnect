import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

function orderedPair(a: string, b: string) {
  return a < b ? { participantAId: a, participantBId: b } : { participantAId: b, participantBId: a };
}

export async function listConversations(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: req.user.id }, { participantBId: req.user.id }],
    },
    orderBy: { lastMessageAt: "desc" },
    select: {
      id: true,
      participantAId: true,
      participantBId: true,
      lastMessage: true,
      lastMessageAt: true,
      participantA: { select: { id: true, fullName: true, avatarUrl: true, isOnline: true } },
      participantB: { select: { id: true, fullName: true, avatarUrl: true, isOnline: true } },
    },
  });

  const ids = conversations.map((c) => c.id);
  const unread = ids.length
    ? await prisma.message.groupBy({
        by: ["conversationId"],
        where: {
          conversationId: { in: ids },
          isRead: false,
          senderId: { not: req.user.id },
        },
        _count: { _all: true },
      })
    : [];

  const unreadMap = new Map(unread.map((u) => [u.conversationId, u._count._all]));

  const data = conversations.map((c) => {
    const other = c.participantAId === req.user!.id ? c.participantB : c.participantA;
    return {
      id: c.id,
      otherParticipant: other,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      unreadCount: unreadMap.get(c.id) ?? 0,
    };
  });

  return res.json({ success: true, data: { conversations: data } });
}

export async function startConversation(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { recipientId } = req.body ?? {};
  if (!recipientId || typeof recipientId !== "string") throw new HttpError(400, "recipientId is required");
  if (recipientId === req.user.id) throw new HttpError(400, "Cannot message yourself");

  const pair = orderedPair(req.user.id, recipientId);

  const existing = await prisma.conversation.findUnique({
    where: { participantAId_participantBId: pair },
  });

  if (existing) {
    return res.json({ success: true, data: { conversation: existing } });
  }

  const conversation = await prisma.conversation.create({ data: pair });
  return res.json({ success: true, data: { conversation } });
}

export async function listMessages(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: conversationId } = req.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { participantAId: true, participantBId: true },
  });
  if (!conversation) throw new HttpError(404, "Conversation not found");
  if (conversation.participantAId !== req.user.id && conversation.participantBId !== req.user.id) {
    throw new HttpError(403, "Forbidden");
  }

  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 30) || 30));
  const skip = (page - 1) * limit;

  await prisma.message.updateMany({
    where: { conversationId, isRead: false, senderId: { not: req.user.id } },
    data: { isRead: true },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    skip,
    take: limit,
    include: {
      sender: { select: { id: true, fullName: true, avatarUrl: true } },
    },
  });

  return res.json({ success: true, data: { messages, page, limit } });
}

export async function sendMessage(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: conversationId } = req.params;
  const { content } = req.body ?? {};
  if (!content || typeof content !== "string") throw new HttpError(400, "content is required");

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { id: true, participantAId: true, participantBId: true },
  });
  if (!conversation) throw new HttpError(404, "Conversation not found");
  if (conversation.participantAId !== req.user.id && conversation.participantBId !== req.user.id) {
    throw new HttpError(403, "Forbidden");
  }

  const otherId = conversation.participantAId === req.user.id ? conversation.participantBId : conversation.participantAId;

  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: { conversationId, senderId: req.user!.id, content },
      include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: content, lastMessageAt: new Date() },
    });

    const actor = await tx.user.findUnique({ where: { id: req.user!.id }, select: { fullName: true } });
    await tx.notification.create({
      data: {
        userId: otherId,
        type: "message",
        referenceId: conversationId,
        message: `${actor?.fullName ?? "Someone"} sent you a message`,
      },
    });

    return created;
  });

  return res.json({ success: true, data: { message } });
}

