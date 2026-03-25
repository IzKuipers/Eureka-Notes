import type { Component } from "svelte";
import { ServerConnector } from "../../ts/api";
import { BlockingOkay } from "../../ts/dialog";
import { ViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import NewFolder from "./NewFolder.svelte";

export class NewFolderDialog extends ModularityDialogInstance {
  override component = NewFolder as Component;
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
  override className = "new-folder";
  saveName = Store<string>();

  async save() {
    const saveName = this.saveName();

    if (!saveName) return;

    const note = await ServerConnector?.createFolder(`${ViewerState?.path()}/${saveName}`);

    if (!note) {
      await BlockingOkay(
        "Failed to create folder",
        "A folder with that name might already exist in this folder. Please choose a different name.",
      );
      return;
    }

    await ViewerState?.refresh();
    this.close();
    ViewerState?.resetStatus();
  }

  onOpen(): void {
    ViewerState?.setTemporaryStatus("Creating a new folder");
  }

  onClose(): void {
    ViewerState?.resetStatus();
  }
}
