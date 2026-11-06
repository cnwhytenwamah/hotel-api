import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";

const router = Router();

router.get("/", availabilityController.search);

export default router;