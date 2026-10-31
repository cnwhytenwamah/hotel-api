import app from "./app";
import { env } from "./config/env";
import { connectDatabase, sequelize } from "./config/database";
import { connectRedis, redisConnection } from "./config/redis";
import { notificationQueue } from "./queues/notification.queue";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await connectRedis();

    const server = app.listen(env.PORT, () => {
      console.log("-----------------------------------");
      console.log("Hotel API successfully started");
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Port: ${env.PORT}`);
      console.log(`API: http://localhost:${env.PORT}${env.API_PREFIX}`);
      console.log("-----------------------------------");
    });

    const shutdown = (signal: NodeJS.Signals): void => {
      console.log(`\n${signal} received. Shutting down server...`);

      server.close(async () => {
        try {
          await notificationQueue.close();
          await sequelize.close();
          await redisConnection.quit();

          console.log("Database and Redis connections closed.");
          process.exit(0);
        } catch (error) {
          console.error("Error during server shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.once("SIGTERM", shutdown);
    process.once("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start Hotel API:", error);
    process.exit(1);
  }
};

void startServer();