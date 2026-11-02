
import { Router } from "express";

import {
  authenticate,
  requireStaff,
} from "../../../middlewares/auth.middleware";
import { amenityController } from "../controller/amenity.controler";

const router = Router();

// Static staff route before any dynamic route
router.get(
  "/staff/all",
  authenticate,
  requireStaff,
  amenityController.getAllForStaff
);

// Public route
router.get("/", amenityController.getPublic);

// Staff management
router.post(
  "/",
  authenticate,
  requireStaff,
  amenityController.create
);

router.patch(
  "/:id",
  authenticate,
  requireStaff,
  amenityController.update
);

router.delete(
  "/:id",
  authenticate,
  requireStaff,
  amenityController.deactivate
);

export default router;
