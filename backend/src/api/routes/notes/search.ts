import Fuse from "fuse.js";
import { GetAllNotesOfUserWithData } from "../../../db/note";
import { RouteCallback } from "../../../types/routes";
import { AssumeAuthorization } from "../../auth";
import { MaybeDefined, RequireDefined } from "../../params";

const NotesSearchRoute = (async (req, res) => {
  const user = await AssumeAuthorization(req);
  const [query] = RequireDefined<[string]>(req, "query");
  const [folderId] = MaybeDefined<[string?]>(req, "folderId");

  // good god this is a fucking mess, STOP LOOKING AT IT ;-;
  const notes = (await GetAllNotesOfUserWithData(user._id.toString(), folderId === "root" ? "" : folderId)).filter((n) =>
    folderId === "root" ? !n.folderId : true
  );

  const fuse = new Fuse(notes, {
    keys: ["name", "data"],
    useExtendedSearch: true,
    shouldSort: true,
    ignoreDiacritics: true,
    threshold: 0.7,
  });

  res.json(
    fuse.search(query).map((i) => ({
      refIndex: i.refIndex,
      item: { ...(i.item as any)._doc, data: undefined },
    }))
  );
}) satisfies RouteCallback;

export default NotesSearchRoute;
