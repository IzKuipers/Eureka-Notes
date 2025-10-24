import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { BlockingOkay, ShowDialog } from "../../ts/dialog";
import { GlobalOpenedState } from "../../ts/state/opened";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import NewNote from "./NewNote.svelte";

export class NewNoteDialog extends ModularityDialogInstance {
  override component = NewNote as Component;
  override buttons: DialogButton[] = [];
  override className = "new-note";
  saveName = Store<string>();
  saveContent = Store<string>();
  loading = Store<boolean>(false);

  async save() {
    const saveName = this.saveName();
    const saveContent = this.saveContent();
    if (!saveName) return;

    this.loading.set(true)

    const note = await GlobalServerConnector?.createNote(saveName, saveContent, GlobalViewerState?.read()?.folderId);

    if (!note) {
      await BlockingOkay(
        "Failed to create note",
        "A note with that name might already exist in this folder. Please choose a different name."
      );
      this.loading.set(false);
      return;
    }

    await GlobalOpenedState?.openNote(note);
    this.close();
    this.loading.set(false);
  }

  async discard() {
    if (this.saveContent()) {
      ShowDialog({
        title: "Discard?",
        message: "Are you sure you want to discard this note? If you don't save now, this note will be lost.",
        buttons: [
          {
            caption: "Cancel",
          },
          {
            caption: "Discard",
            action: () => this.close(),
            autofocus: true
          },
        ],
      });
    } else this.close();
  }

  onOpen(): void {
    GlobalViewerState?.setTemporaryStatus("Creating a new note")
  }

  onClose(): void {
    GlobalViewerState?.resetStatus()
  }
}
