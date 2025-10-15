import { Router } from "express";
import { RouterGenerator } from "./_generator";
import UserRoutes from "./user";
import AuthRoutes from "./auth";

export const RouteDefinitions: Record<string, Router> = {
  "/user": RouterGenerator(UserRoutes, "Users"),
  "/auth": RouterGenerator(AuthRoutes, "Authorization"),
};
