import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import type { NoteSearchResults, PartialEurekaNote } from "../../types/note";
import SearchDialogSvelte from "./SearchDialog.svelte";
import { GlobalOpenedState } from "../../ts/state/opened";
import { GlobalViewerState } from "../../ts/state/viewer";

export class SearchDialog extends ModularityDialogInstance {
  override className = "search-dialog";
  override component = SearchDialogSvelte as Component;

  searching = Store<boolean>(false);
  loading = Store<boolean>(false);
  results = Store<NoteSearchResults>([]);
  everywhere = false;

  constructor(id: string, everywhere?: boolean) {
    super(id, everywhere);

    this.searching.subscribe((v) => {
      this.getDialog()?.classList.toggle("searching", v);
    });
    this.everywhere = !!everywhere;
  }

  async search(query: string) {
    this.searching.set(true);
    this.loading.set(true);

    // good god this is a fucking mess, STOP LOOKING AT IT ;-;
    const results = await GlobalServerConnector!.searchNotes(
      query,
      this.everywhere ? undefined : GlobalViewerState?.read()?.folderId || "root"
    );

    this.loading.set(false);
    this.results.set(results);
  }

  openNote(note: PartialEurekaNote) {
    this.close();
    GlobalOpenedState?.openNote(note);
  }

  reset() {
    this.searching.set(false);
    this.results.set([]);
    this.loading.set(false);
  }
}
