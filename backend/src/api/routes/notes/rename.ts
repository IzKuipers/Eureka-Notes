import { RenameNote } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefined, RequireDefinedParam } from "../../params";

const NotesDeleteRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const [newName] = RequireDefined<[string]>(req, "newName");
  
  const result = await RenameNote(user._id, id, newName);

  res.json(result);
}) satisfies RouteCallback;

export default NotesDeleteRoute;
