import { GetFolderFromPath } from "../../../db/folder";
import { GetFullNote } from "../../../db/note";
import { Notes } from "../../../types/model/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error";
import { MaybeDefined, RequireDefinedParam } from "../../params";

const NotesMoveRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam<[string]>(req, "id");
  const [path] = MaybeDefined<[string?]>(req, "path");
  const note = await GetFullNote(user._id, id);
  const targetFolder = await GetFolderFromPath(user._id, path);

  if (!note) throw new NotFoundError("Note not found");
  if (!targetFolder) throw new NotFoundError("Destination not found");

  await Notes.findByIdAndUpdate(id, { folderId: targetFolder._id });

  stop(200)
}) satisfies RouteCallback;

export default NotesMoveRoute;
