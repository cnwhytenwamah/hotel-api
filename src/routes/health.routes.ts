import { Router } from "express";
import { redisConnection } from "../config/redis";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Hotel API is running",
    data: {
      status: "healthy",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

router.get("/redis", async (_req, res, next) => {
  try {
    const response = await redisConnection.ping();

    res.status(200).json({
      success: true,
      message: "Redis connection is healthy",
      data: {
        status: response === "PONG" ? "connected" : "unknown",
        response,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;