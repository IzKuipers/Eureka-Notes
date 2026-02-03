import { GetPartialNote } from "../../../../db/note";
import { GetNoteShareNodes } from "../../../../db/share";
import { RouteCallback } from "../../../../types/routes";
import { AssumeAuthorization } from "../../../auth";
import { NotFoundError } from "../../../error/classes";
import { RequireDefinedParam } from "../../../params";

const ShareListNoteRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [noteId] = RequireDefinedParam<[string]>(req, "noteId");

  const note = await GetPartialNote(user._id.toString(), noteId);
  if (!note) throw new NotFoundError("Note not found.");

  const shares = await GetNoteShareNodes(user._id.toString(), noteId);

  res.json(shares);
}) satisfies RouteCallback;

export default ShareListNoteRoute;
