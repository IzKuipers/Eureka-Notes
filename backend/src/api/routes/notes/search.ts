import Fuse from "fuse.js";
import { GetAllNotesOfUserWithData } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefinedParam } from "../../params";

const NotesSearchRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [query] = RequireDefinedParam<[string]>(req, "query");
  const notes = await GetAllNotesOfUserWithData(user._id.toString());

  const fuse = new Fuse(notes, {
    keys: ["name", "data"],
  });

  res.json(fuse.search(query));
}) satisfies RouteCallback;

export default NotesSearchRoute;
