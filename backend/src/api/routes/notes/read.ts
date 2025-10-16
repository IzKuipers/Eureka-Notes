import { GetFullNote } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefinedParam } from "../../params";

const NotesReadRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");

  const note = await GetFullNote(user._id, id);

  if (!note) throw new NotFoundError("Note not found");

  res.json(note);
}) satisfies RouteCallback;

export default NotesReadRoute;
