import type { Component } from "svelte";
import { ServerConnector } from "../../ts/api";
import { ViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularDialog, type DialogButton } from "../../types/dialog";
import type { ExistingEurekaNote } from "../../types/note";
import DeleteNotes from "./DeleteNotes.svelte";

export class DeleteNotesDialog extends ModularDialog {
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

      await ServerConnector.deleteNote(note._id);

      this.done.set(this.done() + 1);
    }

    this.status.set("Finishing up...");

    this.close();
    ViewerState.refresh();
  }

  onOpen(): void {
    ViewerState.setTemporaryStatus("Deleting notes");
  }

  onClose(): void {
    ViewerState.resetStatus();
  }
}
