import { NewFolderDialog } from "../../dialogs/NewFolder/NewFolder";
import { NewNoteDialog } from "../../dialogs/NewNote/NewNote";
import type { PartialEurekaNote } from "../../types/note";
import { UserInfo } from "../api/stores";
import { Store } from "../writable";
import { EditorState } from "./editor";

export let GlobalOpenedState: OpenedState | undefined;

export class OpenedState {
  editors = Store<Map<string, EditorState>>(new Map([]));

  constructor() {
    GlobalOpenedState = this;
  }

  async openNote(partial: PartialEurekaNote) {
    if (this.editors().has(partial._id)) return false;

    const editor = new EditorState(partial);
    editor.fullNote.set({ ...partial, userId: UserInfo()?._id!, data: "" });
    this.editors.update((v) => {
      v.set(partial._id, editor);
      return v;
    });

    await editor.read();

    return true;
  }

  newNote() {
    NewNoteDialog.Invoke();
  }

  newFolder() {
    NewFolderDialog.Invoke();
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
