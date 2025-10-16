import { RouteCallback } from "../../types/routes";
import AuthLoginRoute from "../routes/auth/login";
import AuthLogoutRoute from "../routes/auth/logout";
import AuthRegisterRoute from "../routes/auth/register";
import AuthUserInfoRoute from "../routes/auth/user/info";
import {
  AuthUserPreferencesGetRoute,
  AuthUserPreferencesPutRoute,
} from "../routes/auth/user/preferences";
import { GET, POST, PUT } from "./_generator";

export const AuthRoutes: Record<string, RouteCallback> = {
  [POST("/login")]: AuthLoginRoute,
  [POST("/logout")]: AuthLogoutRoute,
  [POST("/register")]: AuthRegisterRoute,
  [GET("/user/info")]: AuthUserInfoRoute,
  [GET("/user/preferences")]: AuthUserPreferencesGetRoute,
  [PUT("/user/preferences")]: AuthUserPreferencesPutRoute,
};

export default AuthRoutes;
