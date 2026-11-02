
import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../modules/auth/routes/auth.routes";
import hotelRoutes from "../modules/hotels/routes/hotel.routes";
import roomTypeRoutes from "../modules/room-types/routes/room-type.route";
import amenityRoutes from "../modules/amenities/routes/amenity.routes";
import roomRoutes from "../modules/rooms/routes/room.routes";
import roomImageRoutes from "../modules/room-types/routes/room-image.routes";
import roomTypeRateRoutes from "../modules/room-types/routes/room-type-rate.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/room-types", roomTypeRoutes);
router.use("/amenities", amenityRoutes);
router.use("/rooms", roomRoutes);
router.use("/room-types", roomImageRoutes);
router.use("/room-types", roomTypeRateRoutes);

export default router;
