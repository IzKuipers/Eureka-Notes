import { RouteCallback } from "../../types/routes";
import PingRoute from "../routes/ping";
import { GET } from "./_generator";

export const BaseRoutes: Record<string, RouteCallback> = {
  [GET("/ping")]: PingRoute,
};
