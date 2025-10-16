import mongoose from "mongoose";
import config from "../../config.json";
import { Logger } from "../logging";

export async function connectDB() {
  Logger.info("DB: Now trying to connect to MongoDB...");

  try {
    await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`);

    Logger.info("DB: MongoDB connected successfully.");
  } catch (e) {
    Logger.warn(`DB: Failed to connect to the database. Please check the connection. ${e}`);

    process.exit(1);
  }
}

export default connectDB;
