import { Router } from "express";
import { bookingHoldController } from "../controllers/booking-hold.controller";

const router = Router();

router.post("/", bookingHoldController.create);
router.post("/release", bookingHoldController.release);

export default router;