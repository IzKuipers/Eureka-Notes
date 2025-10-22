import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { BlockingOkay } from "../../ts/dialog";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import type { FolderRead } from "../../types/folder";
import type { PartialEurekaNote } from "../../types/note";
import MoveNotes from "./MoveNotes.svelte";

export class MoveNotesDialog extends ModularityDialogInstance {
  override component = MoveNotes as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
      action: () => this.close(),
    },
    {
      caption: "Move here",
      action: () => this.doMove(),
    },
  ];
  public className = "move-notes";
  destinationFolder = Store<string>();
  notes: PartialEurekaNote[];
  total: number;
  done = Store<number>(0);
  status = Store<string>("Ready.");
  errors = Store<number>(0);
  folder?: FolderRead;

  constructor(id: string, ...props: PartialEurekaNote[]) {
    super(id, ...props);

    this.notes = props;
    this.total = this.notes.length;
    this.folder = GlobalViewerState?.read();
  }

  async doMove() {
    if (!this.folder) return this.close();

    for (const note of this.notes) {
      this.status.set(`Moving ${note.name}...`);

      const moved = await GlobalServerConnector?.moveNote(note._id, this.destinationFolder());
      if (!moved) this.errors.set(this.errors() + 1);

      this.done.set(this.done() + 1);
    }

    if (this.errors()) {
      await BlockingOkay(
        "Move incomplete",
        "Some notes could not be moved to the target folder. There might already be notes with those names in the folder."
      );
    }

    this.status.set("Finishing up...");

    await GlobalViewerState?.refresh();
    this.close();
  }
}
