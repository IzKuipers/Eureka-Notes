import { Router } from "express";
import { RouterGenerator } from "./_generator";
import AuthRoutes from "./auth";
import { BaseRoutes } from "./base";
import { FolderRoutes } from "./folders";
import NotesRoutes from "./notes";

export const RouteDefinitions: Record<string, Router> = {
  "/": RouterGenerator(BaseRoutes, "Base"),
  "/auth": RouterGenerator(AuthRoutes, "Authorization"),
  "/notes": RouterGenerator(NotesRoutes, "Notes"),
  "/folders": RouterGenerator(FolderRoutes, "Folders"),
};
