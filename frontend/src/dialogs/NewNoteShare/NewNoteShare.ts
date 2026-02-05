import type { Component } from "svelte";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import NewNoteShare from "./NewNoteShare.svelte";
import { Store } from "../../ts/writable";
import { GlobalServerConnector } from "../../ts/api";
import { BlockingOkay, ShowDialog } from "../../ts/dialog";
import { ExistingNoteShareDialog } from "../ExistingNoteShare/ExistingNoteShare";

export class NewNoteShareDialog extends ModularityDialogInstance {
  override className?: string | undefined = "new-note-share";
  override component = NewNoteShare as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
      action: () => this.close(),
    },
    {
      caption: "Create",
      action: () => this.create(),
    },
  ];
  private noteId: string;
  public expiresIn = Store<number>(); // 7 days in ms
  public password = Store<string>("");

  constructor(id: string, noteId: string) {
    super(id, noteId);
    this.noteId = noteId;
  }

  async create() {
    const created = await GlobalServerConnector?.createShareNode(this.noteId, this.password() || undefined, this.expiresIn());

    this.close();

    if (!created) {
      await BlockingOkay("Failed to create share", "The share node could not be created. Please try again.");

      return;
    }

    ExistingNoteShareDialog.Invoke(this.noteId);
  }
}
