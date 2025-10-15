import { RouteCallback } from "../../types/routes";
import UserInfoRoute from "../routes/user/info";
import { Path } from "./_generator";

export const UserRoutes: Record<string, RouteCallback> = {
  [Path("/info")]: UserInfoRoute,
};

export default UserRoutes;
