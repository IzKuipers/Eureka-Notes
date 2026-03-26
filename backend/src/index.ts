import { ApiInterface } from "./api";
import { DetermineBuild } from "./build";
import connectDB from "./db";
import { Logger } from "./logging";

export async function Main() {
  Logger.info("Starting backend");

  DetermineBuild();
  await connectDB();
  await ApiInterface.start();
}

Main();
