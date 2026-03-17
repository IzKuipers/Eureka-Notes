import { SetFolderConceiled } from "../../../db/folder";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefined, RequireDefinedParam } from "../../params";

const FoldersConceiledRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam(req, "id");
  const [conceiled] = RequireDefined(req, "conceiled");
  const result = await SetFolderConceiled(user._id.toString(), id, Boolean(JSON.parse(conceiled)));

  res.json(result);
}) satisfies RouteCallback;

export default FoldersConceiledRoute;
