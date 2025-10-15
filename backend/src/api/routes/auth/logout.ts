import { InvalidateTokenByValue } from "../../../db/token";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization, GetTokenFromRequest } from "../../auth";

const AuthLogoutRoute = (async (req, _, stop) => {
  await AssumeAuthorization(req);
  await InvalidateTokenByValue(GetTokenFromRequest(req));

  stop(200);
}) satisfies RouteCallback;

export default AuthLogoutRoute;
