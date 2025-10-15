import { RouteCallback } from "../../../types/routes";

const UserInfoRoute = ((_, res) => {
  res.json({
    foo: "bar",
  });
}) satisfies RouteCallback;

export default UserInfoRoute;
