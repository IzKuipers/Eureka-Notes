import { DeleteShareNode, GetShareById } from "../../../db/share";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { NotFoundError } from "../../error/classes";
import { RequireDefinedParam } from "../../params";

const ShareDeleteRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [shareId] = RequireDefinedParam<[string]>(req, "shareId");
  const share = await GetShareById(user._id.toString(), shareId);
  if (!share) throw new NotFoundError("Share not found.");

  const result = await DeleteShareNode(share._id.toString());
  res.json(result);
}) satisfies RouteCallback;

export default ShareDeleteRoute;
