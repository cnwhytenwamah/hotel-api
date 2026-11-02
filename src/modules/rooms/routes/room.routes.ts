
import { Router } from "express";

import { authenticate, requireStaff } from "../../../middlewares/auth.middleware";
import { roomController } from "../controller/room.controller";

const router = Router();

router.use(authenticate, requireStaff);

router.get("/", roomController.getAll);
router.get("/:id", roomController.getById);
router.post("/", roomController.create);
router.patch("/:id", roomController.update);
router.delete("/:id", roomController.deactivate);

export default router;
