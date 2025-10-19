import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { BlockingOkay } from "../../ts/dialog";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import type { ExistingEurekaFolder } from "../../types/folder";
import type { EurekaNote } from "../../types/note";
import RenameFolder from "./RenameFolder.svelte";

export class RenameFolderDialog extends ModularityDialogInstance {
  override component = RenameFolder as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
      action: () => this.close(),
    },
    {
      caption: "Rename",
      action: () => this.rename(),
    },
  ];
  override className = "rename-note";
  newName = Store<string>();
  oldName: string;

  constructor(id: string, ...props: any[]) {
    super(id, ...props);
    this.oldName = (props[0] as EurekaNote)?.name;
  }

  async rename() {
    const folder = this.props[0] as ExistingEurekaFolder;
    const newName = this.newName();

    if (!newName || !folder) return;

    const result = await GlobalServerConnector?.renameFolder(folder._id, newName);

    if (!result) {
      await BlockingOkay(
        "Failed to rename folder",
        "A folder with that name might already exist in this folder. Please choose a different name."
      );
      return;
    }

    await GlobalViewerState?.refresh();
    this.close();
  }
}
