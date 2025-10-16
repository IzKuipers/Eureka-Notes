import { DeleteFolder } from "../../../db/folder";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefinedParam } from "../../params";

const FoldersDeleteRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [path] = RequireDefinedParam<[string]>(req, "path");

  await DeleteFolder(user._id, path);

  stop(200);
}) satisfies RouteCallback;

export default FoldersDeleteRoute;
