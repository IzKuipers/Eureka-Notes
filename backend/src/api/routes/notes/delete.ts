import { DeleteNote } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefinedParam } from "../../params";

const NotesDeleteRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");

  const result = await DeleteNote(user._id, id);

  if (!result.acknowledged) throw new NotFoundError("Note not found");

  res.json(result);
}) satisfies RouteCallback;

export default NotesDeleteRoute;
