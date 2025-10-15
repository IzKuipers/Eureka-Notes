import { AuthenticateUser } from "../../../db/token";
import { RouteCallback } from "../../../types/routes";
import { AssumeNoAuthorization } from "../../auth";
import { RequireDefined } from "../../params";

const AuthLoginRoute = (async (req, res, stop) => {
  AssumeNoAuthorization(req);
  const [username, password] = RequireDefined(req, "username", "password");

  try {
    const token = await AuthenticateUser(username, password);

    res.json({ token });
  } catch {
    stop(401);
  }
}) satisfies RouteCallback;

export default AuthLoginRoute;
