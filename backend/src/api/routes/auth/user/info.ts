import { RouteCallback } from "../../../../types/routes";
import { AssumeAuthorization } from "../../../auth";

const AuthUserInfoRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);

  // I still don't know why mongoose results trip if I spread them, so _doc it is
  res.json({ ...(user as any)._doc, passwordHash: undefined });
}) satisfies RouteCallback;

export default AuthUserInfoRoute;
