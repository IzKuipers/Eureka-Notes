import type { Component } from "svelte";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import { type ShareListItem } from "../../types/share";
import { NewNoteShareDialog } from "../NewNoteShare/NewNoteShare";
import ExistingNoteShare from "./ExistingNoteShare.svelte";
import { BlockingOkay, Confirmation } from "../../ts/dialog";
import { ServerConnector } from "../../ts/api";

export class ExistingNoteShareDialog extends ModularityDialogInstance {
  public override component = ExistingNoteShare as Component;
  public override className = "existing-note-share";
  public override buttons: DialogButton[] = [
    {
      caption: "Delete share",
      className: "delete-share",
      action: () => this.deleteShare(),
    },
    {
      caption: "Copy link",
      action: () => this.copyLink(),
    },
    {
      caption: "Okay",
      action: () => this.close(),
    },
  ];
  public shareInfo = Store<ShareListItem | undefined>();
  private noteId: string;

  constructor(id: string, noteId: string) {
    super(id, noteId);

    this.noteId = noteId;
  }

  async openCondition(): Promise<boolean> {
    const share = (await ServerConnector?.getNoteShares(this.noteId))?.[0];

    if (!share) {
      NewNoteShareDialog.Invoke(this.noteId);
      return false;
    }

    return true;
  }

  async onOpen(): Promise<void> {
    const share = (await ServerConnector?.getNoteShares(this.noteId))?.[0];

    this.loading.set(true);
    this.shareInfo.set(share);
    this.loading.set(false);
  }

  async deleteShare() {
    const proceed = await Confirmation(
      "Delete share?",
      "Are you sure you want to delete this share? People using this share won't be able to access this note anymore.",
    );
    if (!proceed) return;

    const shareInfo = this.shareInfo();
    if (!shareInfo) return;

    const result = await ServerConnector?.deleteShareById(shareInfo._id);

    if (!result) {
      await BlockingOkay("Failed to delete share", "The share node could not be deleted. Please try again.", "trash-2");
      return;
    }

    this.close();
  }

  async copyLink() {
    const shareInfo = this.shareInfo();

    if (!shareInfo) return;

    const url = `${location.origin}/?share=${shareInfo.value}`;

    navigator.clipboard.writeText(url);
  }
}
