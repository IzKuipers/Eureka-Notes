import { ReadFolder, ReadFolderById } from "../../../db/folder";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefinedParam } from "../../params";

export const FoldersReadRootRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const folder = await ReadFolder(user._id);

  res.json(folder);
}) satisfies RouteCallback;

export const FoldersReadPathRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [path] = RequireDefinedParam<[string]>(req, "path");
  const folder = await ReadFolder(user._id, path);

  res.json(folder);
}) satisfies RouteCallback;

export const FoldersReadIdRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const folder = await ReadFolderById(user._id, id);

  res.json(folder);
}) satisfies RouteCallback;
