import { RouteCallback } from "../../types/routes";
import ShareCreateRoute from "../routes/shares/create";
import ShareDeleteRoute from "../routes/shares/delete";
import ShareListNoteRoute from "../routes/shares/list/note";
import ShareListUserRoute from "../routes/shares/list/user";
import ShareReadRoute from "../routes/shares/read";
import { DELETE, GET, POST } from "./_generator";

export const ShareRoutes: Record<string, RouteCallback> = {
  [GET("/read/:value")]: ShareReadRoute,
  [GET("/list/user")]: ShareListUserRoute,
  [GET("/list/note/:noteId")]: ShareListNoteRoute,
  [POST("/create")]: ShareCreateRoute,
  [DELETE("/delete/:shareId")]: ShareDeleteRoute,
};
