import { Router } from "express";
import { RouterGenerator } from "./_generator";
import AuthRoutes from "./auth";

export const RouteDefinitions: Record<string, Router> = {
  "/auth": RouterGenerator(AuthRoutes, "Authorization"),
};
