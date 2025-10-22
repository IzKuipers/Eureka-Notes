import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import type { ExistingEurekaFolder } from "../../types/folder";
import MoveFolder from "./MoveFolder.svelte";

export class MoveFolderDialog extends ModularityDialogInstance {
  override component = MoveFolder as Component;
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
  public className = "move-folder";
  destinationFolder = Store<string>();
  folder: ExistingEurekaFolder;

  constructor(id: string, ...props: any[]) {
    super(id, ...props);

    this.folder = props[0] as ExistingEurekaFolder;
  }

  async doMove() {
    await GlobalServerConnector?.moveFolder(this.folder._id, this.destinationFolder());
    await GlobalViewerState?.refresh();
    this.close();
  }
}
