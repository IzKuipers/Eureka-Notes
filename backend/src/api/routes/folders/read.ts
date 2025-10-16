import { ReadFolder } from "../../../db/folder";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefinedParam } from "../../params";

export const FolderReadRootRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const folder = await ReadFolder(user._id);

  res.json(folder);
}) satisfies RouteCallback;

export const FolderReadPathRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [path] = RequireDefinedParam<[string]>(req, "path");
  const folder = await ReadFolder(user._id, path);

  res.json(folder);
}) satisfies RouteCallback;
