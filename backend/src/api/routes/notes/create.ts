import { CreateNote } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { MaybeDefined, RequireDefined } from "../../params";

const NotesCreateRoute = (async (req, _, stop) => {
  const [name, data] = RequireDefined(req, "name", "data");
  const [folderId] = MaybeDefined(req, "folderId");
  const user = await AssumeAuthorization(req);

  await CreateNote(user._id, name, data, folderId);

  stop(200);
}) satisfies RouteCallback;

export default NotesCreateRoute;
