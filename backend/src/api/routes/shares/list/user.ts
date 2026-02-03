import { GetUserShareNodes } from "../../../../db/share";
import { RouteCallback } from "../../../../types/routes";
import { AssumeAuthorization } from "../../../auth";

const ShareListUserRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const shares = await GetUserShareNodes(user._id.toString());

  res.json(shares);
}) satisfies RouteCallback;

export default ShareListUserRoute;
