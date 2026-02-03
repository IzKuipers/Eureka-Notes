import { GetNoteByShareValue } from "../../../db/share";
import { RouteCallback } from "../../../types/routes";
import { AssumeNoAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefinedParam } from "../../params";

const ShareReadRoute = (async (req, res) => {
  AssumeNoAuthorization(req);
  const [value] = RequireDefinedParam<[string]>(req, "value");
  const note = await GetNoteByShareValue(value);

  if (!note) throw new NotFoundError("Share node not found or expired.");

  res.json(note);
}) satisfies RouteCallback;

export default ShareReadRoute;
