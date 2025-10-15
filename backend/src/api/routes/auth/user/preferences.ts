import { SetUserPreferences } from "../../../../db/user";
import { RouteCallback } from "../../../../types/routes";
import { AssumeAuthorization } from "../../../auth";
import { RequireContentType } from "../../../params";

export const AuthUserPreferencesGetRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);

  res.json(user.preferences || {});
}) satisfies RouteCallback;

export const AuthUserPreferencesPutRoute = (async (req, _, stop) => {
  RequireContentType(req, "application/json");

  const user = await AssumeAuthorization(req);

  await SetUserPreferences(user._id, req.body);

  stop(200);
}) satisfies RouteCallback;
