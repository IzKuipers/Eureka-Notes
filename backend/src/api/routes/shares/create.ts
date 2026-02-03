import { GetPartialNote } from "../../../db/note";
import { CreateShareNode } from "../../../db/share";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { MaybeDefined, RequireDefined } from "../../params";

const ShareCreateRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [noteId] = RequireDefined<[string]>(req, "noteId");
  const [password, expiresIn] = MaybeDefined<[string, number]>(req, "password", "expiresIn");

  const note = await GetPartialNote(user._id.toString(), noteId);
  if (!note) throw new NotFoundError("Note not found.");

  const result = await CreateShareNode(user._id.toString(), noteId, password, +expiresIn);

  res.json(result);
}) satisfies RouteCallback;

export default ShareCreateRoute;
