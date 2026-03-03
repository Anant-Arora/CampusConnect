import { Router } from "express";
import multer from "multer";
import { uploadAvatar, uploadPostImage } from "../controllers/uploadController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(authMiddleware);

router.post("/upload/avatar", upload.single("avatar"), asyncHandler(uploadAvatar));
router.post("/upload/post-image", upload.single("image"), asyncHandler(uploadPostImage));

export default router;

