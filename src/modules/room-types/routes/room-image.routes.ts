
import { Router } from "express";

import {
  authenticate,
  requireStaff,
} from "../../../middlewares/auth.middleware";
import { roomImageController } from "../controller/room-image.controller";

const router = Router();

router.get(
  "/:roomTypeId/images",
  roomImageController.getAll
);

router.post(
  "/:roomTypeId/images",
  authenticate,
  requireStaff,
  roomImageController.create
);

router.patch(
  "/:roomTypeId/images/:imageId",
  authenticate,
  requireStaff,
  roomImageController.update
);

router.delete(
  "/:roomTypeId/images/:imageId",
  authenticate,
  requireStaff,
  roomImageController.delete
);

export default router;
