import { GetNoteByShareValue } from "../../../db/share";
import { RouteCallback } from "../../../types/routes";
import { AssumeNoAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefinedParam } from "../../params";

const ShareReadRoute = (async (req, res) => {
  AssumeNoAuthorization(req);
  const [value] = RequireDefinedParam<[string]>(req, "value");
  const noteResult = await GetNoteByShareValue(value, `${req.query.password ?? ""}`);

  if (!noteResult.success) throw noteResult.error ?? new NotFoundError("Share node not found or expired.");

  res.json(noteResult.result!);
}) satisfies RouteCallback;

export default ShareReadRoute;
