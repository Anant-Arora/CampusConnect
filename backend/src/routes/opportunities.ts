import { Router } from "express";
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunity,
  listOpportunities,
  saveOpportunity,
  unsaveOpportunity,
} from "../controllers/opportunityController";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.get("/opportunities", optionalAuthMiddleware, asyncHandler(listOpportunities));
router.get("/opportunities/:id", asyncHandler(getOpportunity));

router.post("/opportunities", authMiddleware, asyncHandler(createOpportunity));
router.delete("/opportunities/:id", authMiddleware, asyncHandler(deleteOpportunity));
router.post("/opportunities/:id/save", authMiddleware, asyncHandler(saveOpportunity));
router.delete("/opportunities/:id/save", authMiddleware, asyncHandler(unsaveOpportunity));

export default router;

