import { RouteCallback } from "../../types/routes";
import AuthLoginRoute from "../routes/auth/login";
import AuthLogoutRoute from "../routes/auth/logout";
import AuthRegisterRoute from "../routes/auth/register";
import AuthUserInfoRoute from "../routes/auth/user/info";
import {
  AuthUserPreferencesGetRoute,
  AuthUserPreferencesPutRoute,
} from "../routes/auth/user/preferences";
import { Path } from "./_generator";

export const AuthRoutes: Record<string, RouteCallback> = {
  [Path("/login", "post")]: AuthLoginRoute,
  [Path("/logout", "post")]: AuthLogoutRoute,
  [Path("/register", "post")]: AuthRegisterRoute,
  [Path("/user/info")]: AuthUserInfoRoute,
  [Path("/user/preferences")]: AuthUserPreferencesGetRoute,
  [Path("/user/preferences", "put")]: AuthUserPreferencesPutRoute,
};

export default AuthRoutes;
