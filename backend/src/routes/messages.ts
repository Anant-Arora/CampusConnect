import { Router } from "express";
import {
  listConversations,
  listMessages,
  sendMessage,
  startConversation,
} from "../controllers/messageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

router.get("/conversations", asyncHandler(listConversations));
router.post("/conversations", asyncHandler(startConversation));
router.get("/conversations/:id/messages", asyncHandler(listMessages));
router.post("/conversations/:id/messages", asyncHandler(sendMessage));

export default router;

