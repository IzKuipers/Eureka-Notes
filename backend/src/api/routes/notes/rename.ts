import { RenameNote } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefined, RequireDefinedParam } from "../../params";

const NotesRenameRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const [newName] = RequireDefined<[string]>(req, "newName");

  const result = await RenameNote(user._id, id, newName);
  const ack = result.acknowledged;

  if (!ack) throw new NotFoundError("Note not found");

  res.json(result);
}) satisfies RouteCallback;

export default NotesRenameRoute;
