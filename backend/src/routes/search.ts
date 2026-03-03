import { Router } from "express";
import { globalSearch } from "../controllers/searchController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

router.get("/search", asyncHandler(globalSearch));

export default router;

