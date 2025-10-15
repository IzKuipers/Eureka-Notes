import { RouteCallback } from "../../types/routes";
import AuthLoginRoute from "../routes/auth/login";
import AuthRegisterRoute from "../routes/auth/register";
import { Path } from "./_generator";

export const AuthRoutes: Record<string, RouteCallback> = {
  [Path("/login", "post")]: AuthLoginRoute,
  [Path("/register", "post")]: AuthRegisterRoute,
};

export default AuthRoutes;
