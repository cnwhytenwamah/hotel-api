import { Router } from "express";
import { quotationController } from "../controllers/quotation.controller";

const router = Router();

router.get("/", quotationController.create);

export default router;