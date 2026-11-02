
import { Router } from "express";

import {
  authenticate,
  requireStaff,
} from "../../../middlewares/auth.middleware";
import { roomTypeRateController } from "../controller/room-type-rate.controller";

const router = Router();

router.use(authenticate, requireStaff);

router.get("/:roomTypeId/rates", roomTypeRateController.getAll);
router.post("/:roomTypeId/rates", roomTypeRateController.create);

router.patch(
  "/:roomTypeId/rates/:rateId",
  roomTypeRateController.update
);

router.delete(
  "/:roomTypeId/rates/:rateId",
  roomTypeRateController.deactivate
);

export default router;
