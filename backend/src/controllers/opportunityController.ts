import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorMiddleware";

export async function listOpportunities(req: Request, res: Response) {
  const type = typeof req.query.type === "string" ? req.query.type.trim() : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10) || 10));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.type = type;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { skills: { has: search } },
    ];
  }

  const opps = await prisma.opportunity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      user: { select: { id: true, fullName: true, college: true, avatarUrl: true } },
      savedBy: req.user ? { where: { userId: req.user.id }, select: { id: true } } : false,
    },
  });

  const opportunities = opps.map((o: any) => {
    const isSaved = Array.isArray(o.savedBy) ? o.savedBy.length > 0 : false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { savedBy, ...rest } = o;
    return { ...rest, isSaved };
  });

  return res.json({ success: true, data: { opportunities, page, limit } });
}

export async function createOpportunity(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const { title, company, description, type, skills, location, isRemote, applyLink, deadline } = req.body ?? {};
  if (!title || !company || !description || !type || !Array.isArray(skills)) {
    throw new HttpError(400, "Missing required fields");
  }

  const opportunity = await prisma.opportunity.create({
    data: {
      postedBy: req.user.id,
      title,
      company,
      description,
      type,
      skills,
      location: typeof location === "string" ? location : null,
      isRemote: typeof isRemote === "boolean" ? isRemote : false,
      applyLink: typeof applyLink === "string" ? applyLink : null,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  return res.json({ success: true, data: { opportunity } });
}

export async function getOpportunity(req: Request, res: Response) {
  const { id } = req.params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, fullName: true, college: true, avatarUrl: true } },
    },
  });
  if (!opportunity) throw new HttpError(404, "Opportunity not found");
  return res.json({ success: true, data: { opportunity } });
}

export async function deleteOpportunity(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id } = req.params;

  const opp = await prisma.opportunity.findUnique({ where: { id }, select: { postedBy: true } });
  if (!opp) throw new HttpError(404, "Opportunity not found");
  if (opp.postedBy !== req.user.id) throw new HttpError(403, "Forbidden");

  await prisma.opportunity.delete({ where: { id } });
  return res.json({ success: true, data: {} });
}

export async function saveOpportunity(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: opportunityId } = req.params;

  await prisma.savedOpportunity.upsert({
    where: { userId_opportunityId: { userId: req.user.id, opportunityId } },
    update: {},
    create: { userId: req.user.id, opportunityId },
  });

  return res.json({ success: true, data: { saved: true } });
}

export async function unsaveOpportunity(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id: opportunityId } = req.params;

  await prisma.savedOpportunity.deleteMany({
    where: { userId: req.user.id, opportunityId },
  });

  return res.json({ success: true, data: { saved: false } });
}

