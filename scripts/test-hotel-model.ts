import { sequelize } from "../src/config/database";
import { Hotel } from "../src/database";

const testHotelModel = async (): Promise<void> => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL connection successful.");

    const hotels = await Hotel.findAll({
      limit: 5,
    });

    console.log("Hotel model query successful.");
    console.log(`Hotels found: ${hotels.length}`);

    console.log(
      "Hotel table attributes:",
      Object.keys(Hotel.getAttributes())
    );
  } catch (error) {
    console.error("Hotel model verification failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

void testHotelModel();