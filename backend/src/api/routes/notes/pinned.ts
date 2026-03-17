import { SetNotePinned } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefined, RequireDefinedParam } from "../../params";

const NotesPinnedRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [id] = RequireDefinedParam(req, "id");
  const [pinned] = RequireDefined(req, "pinned");
  const result = await SetNotePinned(user._id.toString(), id, Boolean(JSON.parse(pinned)));

  res.json(result);
}) satisfies RouteCallback;

export default NotesPinnedRoute;