import { Router } from "express";
import { RouterGenerator } from "./_generator";
import AuthRoutes from "./auth";
import { BaseRoutes } from "./base";
import { FolderRoutes } from "./folders";
import NotesRoutes from "./notes";
import { ShareRoutes } from "./shares";

export const RouteDefinitions: Record<string, Router> = {
  "/": RouterGenerator(BaseRoutes, "Base"),
  "/auth": RouterGenerator(AuthRoutes, "Authorization"),
  "/notes": RouterGenerator(NotesRoutes, "Notes"),
  "/folders": RouterGenerator(FolderRoutes, "Folders"),
  "/shares": RouterGenerator(ShareRoutes, "Shares"),
};
