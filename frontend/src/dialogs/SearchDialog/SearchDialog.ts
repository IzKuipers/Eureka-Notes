import type { Component } from "svelte";
import { ServerConnector } from "../../ts/api";
import { Store } from "../../ts/writable";
import { ModularDialog, type DialogButton } from "../../types/dialog";
import type { NoteSearchResults, PartialEurekaNote } from "../../types/note";
import SearchDialogSvelte from "./SearchDialog.svelte";
import { OpenedState } from "../../ts/state/opened";
import { ViewerState } from "../../ts/state/viewer";

export class SearchDialog extends ModularDialog {
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

    const searchId = this.everywhere ? "everywhere" : ViewerState.read()?.folderId;

    // good god this is a fucking mess, STOP LOOKING AT IT ;-;
    const results = await ServerConnector.searchNotes(query, searchId || "root");

    this.loading.set(false);
    this.results.set(results);
  }

  openNote(note: PartialEurekaNote) {
    this.close();
    OpenedState.openNote(note);
  }

  reset() {
    this.searching.set(false);
    this.results.set([]);
    this.loading.set(false);
  }
}
