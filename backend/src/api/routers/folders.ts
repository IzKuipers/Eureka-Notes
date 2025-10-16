import { RouteCallback } from "../../types/routes";
import FoldersCreateRoute from "../routes/folders/create";
import FoldersDeleteRoute from "../routes/folders/delete";
import FoldersMoveRoute from "../routes/folders/move";
import { FoldersReadPathRoute, FoldersReadRootRoute } from "../routes/folders/read";
import FoldersRenameRoute from "../routes/folders/rename";
import { DELETE, GET, PATCH, POST } from "./_generator";

export const FolderRoutes: Record<string, RouteCallback> = {
  [GET("/read")]: FoldersReadRootRoute,
  [GET("/read/:path(*)")]: FoldersReadPathRoute,
  [DELETE("/delete")]: FoldersDeleteRoute,
  [PATCH("/move")]: FoldersMoveRoute,
  [PATCH("/rename/:id")]: FoldersRenameRoute,
  [POST("/create/:path(*)")]: FoldersCreateRoute,
};
