import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

export async function listPosts(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10) || 10));
  const skip = (page - 1) * limit;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      user: { select: { id: true, fullName: true, college: true, avatarUrl: true } },
      likes: { where: { userId: req.user.id }, select: { id: true } },
    },
  });

  const data = posts.map((p) => {
    const hasLiked = p.likes.length > 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likes, ...rest } = p;
    return { ...rest, hasLiked };
  });

  return res.json({ success: true, data: { posts: data, page, limit } });
}

export async function createPost(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { content, imageUrl, linkUrl } = req.body ?? {};
  if (!content || typeof content !== "string") throw new HttpError(400, "content is required");

  const post = await prisma.post.create({
    data: {
      userId: req.user.id,
      content,
      imageUrl: typeof imageUrl === "string" ? imageUrl : null,
      linkUrl: typeof linkUrl === "string" ? linkUrl : null,
    },
    include: {
      user: { select: { id: true, fullName: true, college: true, avatarUrl: true } },
    },
  });

  return res.json({ success: true, data: { post } });
}

export async function deletePost(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id } = req.params;

  const post = await prisma.post.findUnique({ where: { id }, select: { userId: true } });
  if (!post) throw new HttpError(404, "Post not found");
  if (post.userId !== req.user.id) throw new HttpError(403, "Forbidden");

  await prisma.post.delete({ where: { id } });
  return res.json({ success: true, data: {} });
}

export async function likePost(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: postId } = req.params;

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, userId: true } });
  if (!post) throw new HttpError(404, "Post not found");

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId: req.user.id } },
    select: { id: true },
  });

  if (!existing) {
    await prisma.$transaction(async (tx) => {
      await tx.postLike.create({ data: { postId, userId: req.user!.id } });
      await tx.post.update({ where: { id: postId }, data: { likesCount: { increment: 1 } } });

      if (post.userId !== req.user!.id) {
        const actor = await tx.user.findUnique({
          where: { id: req.user!.id },
          select: { fullName: true },
        });
        await tx.notification.create({
          data: {
            userId: post.userId,
            type: "like",
            referenceId: postId,
            message: `${actor?.fullName ?? "Someone"} liked your post`,
          },
        });
      }
    });
  }

  return res.json({ success: true, data: { liked: true } });
}

export async function unlikePost(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: postId } = req.params;

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId: req.user.id } },
    select: { id: true },
  });

  if (!existing) return res.json({ success: true, data: { liked: false } });

  await prisma.$transaction(async (tx) => {
    await tx.postLike.delete({ where: { id: existing.id } });
    await tx.post.update({ where: { id: postId }, data: { likesCount: { decrement: 1 } } });
  });

  return res.json({ success: true, data: { liked: false } });
}

export async function listComments(req: Request, res: Response) {
  const { id: postId } = req.params;
  const comments = await prisma.postComment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, fullName: true, avatarUrl: true } },
    },
  });

  return res.json({ success: true, data: { comments } });
}

export async function addComment(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: postId } = req.params;
  const { content } = req.body ?? {};
  if (!content || typeof content !== "string") throw new HttpError(400, "content is required");

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, userId: true } });
  if (!post) throw new HttpError(404, "Post not found");

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.postComment.create({
      data: { postId, userId: req.user!.id, content },
      include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
    await tx.post.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } });

    if (post.userId !== req.user!.id) {
      const actor = await tx.user.findUnique({
        where: { id: req.user!.id },
        select: { fullName: true },
      });
      await tx.notification.create({
        data: {
          userId: post.userId,
          type: "comment",
          referenceId: postId,
          message: `${actor?.fullName ?? "Someone"} commented on your post`,
        },
      });
    }

    return created;
  });

  return res.json({ success: true, data: { comment } });
}

