import { RouteCallback } from "../../types/routes";

const PingRoute = (async (_, res) => {
  res.json({
    ping: "Pong!",
  });
}) satisfies RouteCallback;

export default PingRoute;
