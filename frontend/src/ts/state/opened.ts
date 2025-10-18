import { NewNoteDialog } from "../../dialogs/NewNote/NewNote";
import type { PartialEurekaNote } from "../../types/note";
import { Store } from "../writable";
import { EditorState } from "./editor";
import { GlobalModularityState } from "./modular";

export let GlobalOpenedState: OpenedState | undefined;

export class OpenedState {
  editors = Store<Map<string, EditorState>>(new Map([]));

  constructor() {
    GlobalOpenedState = this;
  }

  async openNote(partial: PartialEurekaNote) {
    if (this.editors().has(partial._id)) return false;

    const editor = new EditorState(partial);
    await editor.read();

    this.editors.update((v) => {
      v.set(partial._id, editor);
      return v;
    });

    return true;
  }

  newNote() {
    GlobalModularityState?.ShowDialog(NewNoteDialog);
  }

  closeEditor(editor: EditorState) {
    this.editors.update((v) => {
      v.delete(editor.partialNote!._id);

      return v;
    });
  }

  reset() {
    this.editors.set(new Map([]));
  }
}
