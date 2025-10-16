import { CreateNote, GetNoteByName } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { ConflictError } from "../../error";
import { MaybeDefined, RequireDefined } from "../../params";

const NotesCreateRoute = (async (req, _, stop) => {
  const [name, data] = RequireDefined<[string, string]>(req, "name", "data");
  const [folderId] = MaybeDefined<[string?]>(req, "folderId");
  const user = await AssumeAuthorization(req);

  const existing = await GetNoteByName(user._id, name.toLowerCase(), folderId);

  if (existing)
    throw new ConflictError(
      "A note with that name already exists in the specified folder."
    );

  await CreateNote(user._id, name, data, folderId);

  stop(200);
}) satisfies RouteCallback;

export default NotesCreateRoute;
