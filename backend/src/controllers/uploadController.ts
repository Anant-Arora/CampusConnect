import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";
import { getSupabaseAdmin } from "../lib/supabase";
import { HttpError } from "../middleware/errorMiddleware";

function getPublicUrl(bucket: string, path: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) throw new HttpError(400, "Missing avatar file");

  const supabaseAdmin = getSupabaseAdmin();
  const bucket = "avatars";
  const ext = file.originalname.split(".").pop() || "png";
  const path = `${req.user.id}/${uuidv4()}.${ext}`;

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: true,
  });
  if (error) throw new HttpError(500, error.message);

  const avatarUrl = getPublicUrl(bucket, path);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { avatarUrl },
  });

  return res.json({ success: true, data: { avatarUrl } });
}

export async function uploadPostImage(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) throw new HttpError(400, "Missing image file");

  const supabaseAdmin = getSupabaseAdmin();
  const bucket = "post-images";
  const ext = file.originalname.split(".").pop() || "png";
  const path = `${req.user.id}/${uuidv4()}.${ext}`;

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw new HttpError(500, error.message);

  const imageUrl = getPublicUrl(bucket, path);
  return res.json({ success: true, data: { imageUrl } });
}

