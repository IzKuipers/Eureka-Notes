import { ReadFolderById } from "../../../db/folder";
import { Folders } from "../../../types/model/folder";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { ConflictError, NotFoundError } from "../../error/classes";
import { MaybeDefined, RequireDefined } from "../../params";

const FoldersMoveRoute = (async (req, _, stop) => {
  const user = await AssumeAuthorization(req);
  const [sourceId] = RequireDefined<[string]>(req, "id");
  const [destinationId] = MaybeDefined<[string?]>(req, "destinationId");
  const sourceFolder = await ReadFolderById(user._id, sourceId);
  const destinationFolder = await ReadFolderById(user._id, destinationId);

  if (!sourceFolder) throw new NotFoundError("Note not found");
  if (!destinationFolder) throw new NotFoundError("Destination not found");

  if (destinationFolder.folders.filter((f) => f.name === sourceFolder.folderName).length)
    throw new ConflictError("A folder with that name exists in the destination folder.");

  const result = await Folders.findByIdAndUpdate(sourceId, {
    parentId: destinationId,
  });

  if (!result) return stop(404);

  return stop(200);
}) satisfies RouteCallback;

export default FoldersMoveRoute;
