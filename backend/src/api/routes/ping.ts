import { BUILD_HASH } from "../../build";
import { RouteCallback } from "../../types/routes";
import packageJson from "../../../package.json";

const PingRoute = (async (_, res) => {
  res.json({
    build: BUILD_HASH,
    version: packageJson.version,
    ping: "Pong!",
  });
}) satisfies RouteCallback;

export default PingRoute;
