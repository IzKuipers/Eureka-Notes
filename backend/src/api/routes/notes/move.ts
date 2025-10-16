import { ReadFolder } from "../../../db/folder";
import { GetFullNote } from "../../../db/note";
import { Notes } from "../../../types/model/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { ConflictError, NotFoundError } from "../../error/classes";
import { MaybeDefined, RequireDefinedParam } from "../../params";

const NotesMoveRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const [path] = MaybeDefined<[string?]>(req, "path");
  const note = await GetFullNote(user._id, id);
  const targetFolder = await ReadFolder(user._id, path);

  if (!note) throw new NotFoundError("Note not found");
  if (!targetFolder) throw new NotFoundError("Destination not found");

  if (targetFolder.notes.filter((n) => n.name === note.name).length)
    throw new ConflictError("A note with that name exists in the destination folder.");

  await Notes.findByIdAndUpdate(id, { folderId: targetFolder.folderId });

  stop(200);
}) satisfies RouteCallback;

export default NotesMoveRoute;
