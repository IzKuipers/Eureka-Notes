import config from "../config.json";
import { ApiInterface } from "./api";
import connectDB from "./db";
import { Logger } from "./logging";

export async function Main() {
  Logger.info("Starting backend");

  await connectDB();

  const api = new ApiInterface(config.port);

  await api.start();
}

Main();
