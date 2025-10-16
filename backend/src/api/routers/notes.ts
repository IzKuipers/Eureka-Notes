import { RouteCallback } from "../../types/routes";
import NotesCreateRoute from "../routes/notes/create";
import NotesDeleteRoute from "../routes/notes/delete";
import { NotesListPathRoute, NotesListRootRoute } from "../routes/notes/list";
import NotesMoveRoute from "../routes/notes/move";
import NotesReadRoute from "../routes/notes/read";
import NotesRenameRoute from "../routes/notes/rename";
import NotesWriteRoute from "../routes/notes/write";
import { Path } from "./_generator";

const NotesRoutes: Record<string, RouteCallback> = {
  [Path("/list")]: NotesListRootRoute,
  [Path("/list/:path(*)")]: NotesListPathRoute,
  [Path("/","post")]: NotesCreateRoute,
  [Path("/read/:id")]: NotesReadRoute,
  [Path("/delete/:id","delete")]: NotesDeleteRoute,
  [Path("/rename/:id","patch")]: NotesRenameRoute,
  [Path("/move/:id", "patch")]: NotesMoveRoute,
  [Path("/write/:id", "put")]: NotesWriteRoute
};

export default NotesRoutes;
