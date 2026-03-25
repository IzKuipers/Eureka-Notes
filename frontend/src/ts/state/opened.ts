import { NewFolderDialog } from "../../dialogs/NewFolder/NewFolder";
import { NewNoteDialog } from "../../dialogs/NewNote/NewNote";
import type { PartialEurekaNote } from "../../types/note";
import { UserInfo } from "../api/stores";
import { Store } from "../writable";
import { EditorState } from "./editor";

export class OpenedState {
  static editors = Store<Map<string, EditorState>>(new Map([]));
  static hasCollapsed = Store<boolean>(false);

  static async openNote(partial: PartialEurekaNote) {
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

  static newNote() {
    NewNoteDialog.Invoke();
  }

  static newFolder() {
    NewFolderDialog.Invoke();
  }

  static closeEditor(editor: EditorState) {
    this.editors.update((v) => {
      v.delete(editor.partialNote!._id);

      return v;
    });
    this.updateHasCollapsed();
  }

  static reset() {
    this.editors.set(new Map([]));
  }

  static updateHasCollapsed() {
    this.hasCollapsed.set(!![...(this.editors() || [])]?.filter(([_, v]) => v.collapsed())?.length);
  }
}
