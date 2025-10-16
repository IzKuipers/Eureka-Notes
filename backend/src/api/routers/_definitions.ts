import { Router } from "express";
import { RouterGenerator } from "./_generator";
import AuthRoutes from "./auth";
import NotesRoutes from "./notes";

export const RouteDefinitions: Record<string, Router> = {
  "/auth": RouterGenerator(AuthRoutes, "Authorization"),
  "/notes": RouterGenerator(NotesRoutes, "Notes")
};
