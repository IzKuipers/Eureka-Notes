import { RouteCallback } from "../../types/routes";
import NotesConceiledRoute from "../routes/notes/conceiled";
import NotesCreateRoute from "../routes/notes/create";
import NotesDeleteRoute from "../routes/notes/delete";
import NotesMoveRoute from "../routes/notes/move";
import NotesPinnedRoute from "../routes/notes/pinned";
import NotesReadRoute from "../routes/notes/read";
import NotesRenameRoute from "../routes/notes/rename";
import NotesSearchRoute from "../routes/notes/search";
import NotesWriteRoute from "../routes/notes/write";
import { DELETE, GET, PATCH, POST, PUT } from "./_generator";

const NotesRoutes: Record<string, RouteCallback> = {
  [POST("/")]: NotesCreateRoute,
  [GET("/read/:id")]: NotesReadRoute,
  [DELETE("/delete/:id")]: NotesDeleteRoute,
  [PATCH("/rename/:id")]: NotesRenameRoute,
  [PATCH("/move/:id")]: NotesMoveRoute,
  [PUT("/write/:id")]: NotesWriteRoute,
  [POST("/search")]: NotesSearchRoute,
  [PATCH("/conceiled/:id")]: NotesConceiledRoute,
  [PATCH("/pinned/:id")]: NotesPinnedRoute,
};

export default NotesRoutes;
