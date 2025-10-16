import { RouteCallback } from "../../types/routes";
import FoldersCreateRoute from "../routes/folders/create";
import FoldersDeleteRoute from "../routes/folders/delete";
import FoldersMoveRoute from "../routes/folders/move";
import {
  FoldersReadPathRoute,
  FoldersReadRootRoute,
} from "../routes/folders/read";
import FoldersRenameRoute from "../routes/folders/rename";
import { Path } from "./_generator";

export const FolderRoutes: Record<string, RouteCallback> = {
  [Path("/read")]: FoldersReadRootRoute,
  [Path("/read/:path(*)")]: FoldersReadPathRoute,
  [Path("/delete", "delete")]: FoldersDeleteRoute,
  [Path("/move", "patch")]: FoldersMoveRoute,
  [Path("/rename/:id", "patch")]: FoldersRenameRoute,
  [Path("/", "post")]: FoldersCreateRoute,
};
