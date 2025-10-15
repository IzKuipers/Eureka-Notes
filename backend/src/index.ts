import { ApiInterface } from "./api";
import config from "../config.json";
import { Logger } from "./logging";
import connectDB from "./db";

export async function Main() {
  Logger.info("Starting backend");

  await connectDB();

  const api = new ApiInterface(config.port);

  await api.start();
}

Main();
