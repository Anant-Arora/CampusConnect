import { Router } from "express";
import { getUser, searchUsers, setOnline, updateUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

router.get("/users/search", asyncHandler(searchUsers));
router.get("/users/:id", asyncHandler(getUser));
router.put("/users/:id", asyncHandler(updateUser));
router.put("/users/:id/online", asyncHandler(setOnline));

export default router;

