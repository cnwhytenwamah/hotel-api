
import { Router } from "express";

import {
  authenticate,
  requireStaff,
} from "../../../middlewares/auth.middleware";
import { roomTypeController } from "../controller/room-type.controller";

const router = Router();

// Staff routes with static paths must come before /:id.
router.get(
  "/staff/all",
  authenticate,
  requireStaff,
  roomTypeController.getAllForStaff
);

// Public routes
router.get("/", roomTypeController.getPublic);
router.get("/:id", roomTypeController.getById);

// Staff management routes
router.post(
  "/",
  authenticate,
  requireStaff,
  roomTypeController.create
);

router.patch(
  "/:id",
  authenticate,
  requireStaff,
  roomTypeController.update
);

router.delete(
  "/:id",
  authenticate,
  requireStaff,
  roomTypeController.deactivate
);

router.put(
  "/:id/amenities",
  authenticate,
  requireStaff,
  roomTypeController.assignAmenities
);

export default router;
