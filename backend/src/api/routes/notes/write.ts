import { WriteNote } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefined, RequireDefinedParam } from "../../params";

const NotesWriteRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [data] = RequireDefined<[string]>(req, "data");
  const [id] = RequireDefinedParam<[string]>(req, "id");

  const ack = (await WriteNote(user._id, id, data)).acknowledged;

  if (!ack) throw new NotFoundError("Note not found");

  stop(200);
}) satisfies RouteCallback;

export default NotesWriteRoute;
