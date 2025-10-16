import { RenameFolder } from "../../../db/folder";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error";
import { RequireDefined, RequireDefinedParam } from "../../params";

const FoldersRenameRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const [newName] = RequireDefined<[string]>(req, "newName");

  const result = await RenameFolder(user._id, id, newName);

  if (!result.acknowledged) throw new NotFoundError("Folder not found");

  stop(200);
}) satisfies RouteCallback;

export default FoldersRenameRoute;
