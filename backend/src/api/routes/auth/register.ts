import { CreateUser } from "../../../db/user";
import { RouteCallback } from "../../../types/routes";
import { AssumeNoAuthorization } from "../../auth";
import { ConflictError } from "../../error/classes";
import { RequireDefined } from "../../params";

const AuthRegisterRoute = (async (req, _, stop) => {
  AssumeNoAuthorization(req);
  const [username, password] = RequireDefined(req, "username", "password");

  try {
    await CreateUser(username, password);
    stop(200);
  } catch {
    throw new ConflictError("Username is already in use");
  }
}) satisfies RouteCallback;

export default AuthRegisterRoute;
