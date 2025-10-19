import { GetFolderById } from "../../../db/folder";
import { GetAllNotesOfUser, GetPartialNote } from "../../../db/note";
import { Notes } from "../../../types/model/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { ConflictError, NotFoundError } from "../../error/classes";
import { MaybeDefined, RequireDefinedParam } from "../../params";

const NotesMoveRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const [newFolderId] = MaybeDefined<[string?]>(req, "newFolderId");
  const note = await GetPartialNote(user._id, id);
  const targetFolder = await GetFolderById(user._id, newFolderId || "");
  const targetFolderNotes = await GetAllNotesOfUser(user._id.toString(), newFolderId || "");

  if (!note) throw new NotFoundError("Note not found");
  if (!targetFolder) throw new NotFoundError("Destination not found");

  if (targetFolderNotes?.filter((n) => n.name === note.name).length)
    throw new ConflictError("A note with that name exists in the destination folder.");

  await Notes.findByIdAndUpdate(id, { folderId: targetFolder._id });

  stop(200);
}) satisfies RouteCallback;

export default NotesMoveRoute;
