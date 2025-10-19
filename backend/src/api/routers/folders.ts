import { RouteCallback } from "../../types/routes";
import FoldersCreateRoute from "../routes/folders/create";
import FoldersDeleteRoute from "../routes/folders/delete";
import FoldersMoveRoute from "../routes/folders/move";
import { FoldersReadIdRoute, FoldersReadPathRoute, FoldersReadRootRoute } from "../routes/folders/read";
import FoldersRenameRoute from "../routes/folders/rename";
import { DELETE, GET, POST } from "./_generator";

export const FolderRoutes: Record<string, RouteCallback> = {
  [GET("/read/path")]: FoldersReadRootRoute,
  [GET("/read/path/:path(*)")]: FoldersReadPathRoute,
  [GET("/read/id/:id")]: FoldersReadIdRoute,
  [DELETE("/delete/:id")]: FoldersDeleteRoute,
  [POST("/move")]: FoldersMoveRoute,
  [POST("/rename/:id")]: FoldersRenameRoute,
  [POST("/create/:path(*)")]: FoldersCreateRoute,
};
