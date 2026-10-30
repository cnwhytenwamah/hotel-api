import app from "./app";
import { env } from "./config/env";
import { connectDatabase, sequelize } from "./config/database";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

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
          await sequelize.close();
          console.log("Database connection closed.");
          process.exit(0);
        } catch (error) {
          console.error("Error closing database connection:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start Hotel API:", error);
    process.exit(1);
  }
};

void startServer();