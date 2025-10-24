import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { BlockingOkay } from "../../ts/dialog";
import { GlobalOpenedState } from "../../ts/state/opened";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import type { EurekaNote, PartialEurekaNote } from "../../types/note";
import NewNote from "./RenameNote.svelte";

export class RenameNoteDialog extends ModularityDialogInstance {
  override component = NewNote as Component;
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
    const note = this.props[0] as PartialEurekaNote;
    const newName = this.newName();

    if (!newName || !note) return;

    const result = await GlobalServerConnector?.renameNote(note._id, newName);

    if (!result) {
      await BlockingOkay(
        "Failed to rename note",
        "A note with that name might already exist in this folder. Please choose a different name."
      );
      return;
    }

    await GlobalViewerState?.refresh();
    this.close();

    // Below updater changes the note name in the opened editor to the name of the note.
    GlobalOpenedState?.editors.update((os) => {
      const editor = os.get(note._id);

      if (!editor) return os;

      editor?.fullNote.update((fn) => {
        fn.name = newName;
        return fn;
      });
      editor?.path.set(`${editor.currentFolder}/${newName}`);

      os.set(note._id, editor!);
      return os;
    });
  }
  
  onOpen(): void {
    GlobalViewerState?.setTemporaryStatus("Renaming note")
  }

  onClose(): void {
    GlobalViewerState?.resetStatus()
  }
}
