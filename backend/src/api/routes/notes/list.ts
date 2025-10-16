import { GetAllNotesOfUser, GetNotesByPath } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { RequireDefinedParam } from "../../params";

export const NotesListRootRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const notes = await GetAllNotesOfUser(user._id);

  res.json(notes);
}) satisfies RouteCallback;

export const NotesListPathRoute = (async (req, res) => {
  const [path] = RequireDefinedParam(req, "path");
  const user = await AssumeAuthorization(req);
  const notes = await GetNotesByPath(user._id, path);

  res.json(notes);
}) satisfies RouteCallback;
