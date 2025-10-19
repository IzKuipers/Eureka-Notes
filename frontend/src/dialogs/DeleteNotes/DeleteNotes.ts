import type { Component } from "svelte";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import type { ExistingEurekaNote } from "../../types/note";
import DeleteNotes from "./DeleteNotes.svelte";
import { Store } from "../../ts/writable";
import { GlobalServerConnector } from "../../ts/api";
import { GlobalViewerState } from "../../ts/state/viewer";

export class DeleteNotesDialog extends ModularityDialogInstance {
  override component = DeleteNotes as Component;
  override buttons: DialogButton[] = [];
  override className = "delete-notes";
  public done = Store<number>(0);
  public total = this.props.length;
  public status = Store<string>("Please wait...");

  async go() {
    const notes = this.props as ExistingEurekaNote[];

    for (const note of notes) {
      this.status.set(`Deleting ${note.name}`);

      await GlobalServerConnector?.deleteNote(note._id);

      this.done.set(this.done() + 1);
    }

    this.status.set("Finishing up...");

    this.close();
    GlobalViewerState?.refresh();
  }
}
