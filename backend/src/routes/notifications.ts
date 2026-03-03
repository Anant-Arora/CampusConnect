import { Router } from "express";
import { listNotifications, markAllRead } from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

router.get("/notifications", asyncHandler(listNotifications));
router.put("/notifications/read", asyncHandler(markAllRead));

export default router;

