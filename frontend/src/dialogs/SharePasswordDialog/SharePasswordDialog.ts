import type { Component } from "svelte";
import { ModularDialog, type DialogButton } from "../../types/dialog";
import SharePasswordDialogComponent from "./SharePasswordDialog.svelte";
import { ShareState } from "../../ts/state/share";
import { Store } from "../../ts/writable";

export class SharePasswordDialog extends ModularDialog {
  override component = SharePasswordDialogComponent as Component;
  override className = "share-password";
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
      action: () => {
        this.close();
        location.href = `./`;
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
    ShareState.initialize(this.password());
  }
}
