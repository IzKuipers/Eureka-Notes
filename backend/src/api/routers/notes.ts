import { RouteCallback } from "../../types/routes";
import NotesCreateRoute from "../routes/notes/create";
import { NotesListPathRoute, NotesListRootRoute } from "../routes/notes/list";
import NotesReadRoute from "../routes/notes/read";
import { Path } from "./_generator";

const NotesRoutes: Record<string, RouteCallback> = {
  [Path("/list")]: NotesListRootRoute,
  [Path("/list/:path(*)")]: NotesListPathRoute,
  [Path("/","post")]: NotesCreateRoute,
  [Path("/read/:id")]: NotesReadRoute
};

export default NotesRoutes;
