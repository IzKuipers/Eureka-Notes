import { ReadFolder } from "../../../db/folder";
import { Notes } from "../../../types/model/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { ConflictError, NotFoundError } from "../../error";
import { MaybeDefined, RequireDefinedParam } from "../../params";

const FoldersMoveRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [path] = RequireDefinedParam<[string]>(req, "id");
  const [destination] = MaybeDefined<[string?]>(req, "path");
  const sourceFolder = await ReadFolder(user._id, path);
  const destinationFolder = await ReadFolder(user._id, destination);

  if (!sourceFolder) throw new NotFoundError("Note not found");
  if (!destinationFolder) throw new NotFoundError("Destination not found");

  if (
    destinationFolder.folders.filter((f) => f.name === sourceFolder.folderName)
      .length
  )
    throw new ConflictError(
      "A folder with that name exists in the destination folder."
    );

  await Notes.findByIdAndUpdate(sourceFolder.folderId, {
    folderId: destinationFolder.folderId,
  });

  stop(200);
}) satisfies RouteCallback;

export default FoldersMoveRoute;
