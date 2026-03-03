import { Router } from "express";
import {
  addComment,
  createPost,
  deletePost,
  likePost,
  listComments,
  listPosts,
  unlikePost,
} from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

router.get("/posts", asyncHandler(listPosts));
router.post("/posts", asyncHandler(createPost));
router.delete("/posts/:id", asyncHandler(deletePost));

router.post("/posts/:id/like", asyncHandler(likePost));
router.delete("/posts/:id/like", asyncHandler(unlikePost));

router.get("/posts/:id/comments", asyncHandler(listComments));
router.post("/posts/:id/comments", asyncHandler(addComment));

export default router;

