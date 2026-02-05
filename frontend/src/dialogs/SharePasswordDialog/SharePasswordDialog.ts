import type { Component } from "svelte";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import SharePasswordDialogComponent from "./SharePasswordDialog.svelte";
import { GlobalShareState } from "../../ts/state/share";
import { Store } from "../../ts/writable";

export class SharePasswordDialog extends ModularityDialogInstance {
  override component = SharePasswordDialogComponent as Component;
  override className = "share-password";
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
      action: () => {
        this.close();
        location.href = location.origin;
      },
    },
    {
      caption: "Okay",
      action: () => {
        this.unlock();
      },
    },
  ];
  public password = Store<string>();

  constructor(id: string) {
    super(id);
  }

  unlock() {
    if (!this.password()) return;

    this.close();
    GlobalShareState?.initialize(this.password());
  }
}
