import { execSync } from "child_process";

export let BUILD_HASH: string = "";

export async function DetermineBuild() {
  try {
    const hash = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).split("\n")[0].trim();

    BUILD_HASH = hash;
  } catch {
    BUILD_HASH = "unknown";
  }
}
