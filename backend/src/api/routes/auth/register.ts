import { CreateUser } from "../../../db/user";
import { RouteCallback } from "../../../types/routes";
import { AssumeNoAuthorization } from "../../auth";
import { RequireDefined } from "../../params";

const AuthRegisterRoute = (async (req, _, stop) => {
  AssumeNoAuthorization(req);
  const [username, password] = RequireDefined(req, "username", "password");

  try {
    await CreateUser(username, password);
  } catch {
    stop(409);
  }
}) satisfies RouteCallback;

export default AuthRegisterRoute;
