import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import NewNote from "./NewNote.svelte";
import { BlockingOkay } from "../../ts/dialog";
import { GlobalOpenedState } from "../../ts/state/opened";

export class NewNoteDialog extends ModularityDialogInstance {
  override component = NewNote as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
      action: () => this.close(),
    },
    {
      caption: "Create",
      action: () => this.save(),
    },
  ];
  override className = "new-note";
  saveName = Store<string>();

  async save() {
    const saveName = this.saveName();

    if (!saveName) return;

    const note = await GlobalServerConnector?.createNote(saveName, "", GlobalViewerState?.read()?.folderId);

    if (!note) {
      await BlockingOkay(
        "Failed to create note",
        "A note with that name might already exist in this folder. Please choose a different name."
      );
      return;
    }

    await GlobalOpenedState?.openNote(note);
    this.close();
  }
}
