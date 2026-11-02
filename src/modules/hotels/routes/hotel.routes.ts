
import { Router } from "express";

import {
  authenticate,
  requireStaff,
} from "../../../middlewares/auth.middleware";
import { hotelController } from "../controllers/hotel.controller";

const router = Router();

// Static staff route first
router.get(
  "/staff/all",
  authenticate,
  requireStaff,
  hotelController.getAllForStaff
);

// Public routes
router.get("/", hotelController.getPublicHotels);
router.get("/slug/:slug", hotelController.getBySlug);
router.get("/:id", hotelController.getById);

// Staff management routes
router.post(
  "/",
  authenticate,
  requireStaff,
  hotelController.create
);

router.patch(
  "/:id",
  authenticate,
  requireStaff,
  hotelController.update
);

export default router;
