import type { ExistingEurekaNote, PartialEurekaNote } from "../../types/note";
import { ServerConnector } from "../api";
import { ShowDialog } from "../dialog";
import { Sleep } from "../sleep";
import { Store } from "../writable";
import { OpenedState } from "./opened";
import { ViewerState } from "./viewer";

export class EditorState {
  partialNote: PartialEurekaNote;
  noteId?: string;
  fullNote = Store<ExistingEurekaNote>();
  notFound = Store<boolean>(false);
  loading = Store<boolean>(false);
  writing = Store<boolean>(false);
  collapsed = Store<boolean>(false);
  maximized = Store<boolean>(false);
  modified = Store<boolean>(false);
  visible = Store<boolean>(false);
  path = Store<string>();
  currentFolder: string;

  constructor(partial: PartialEurekaNote) {
    this.partialNote = partial;

    this.fullNote.subscribe(() => {
      ViewerState?.setTemporaryStatus(`Editing ${this.partialNote?.name}`);
    });

    this.collapsed.subscribe((v) => {
      OpenedState?.updateHasCollapsed();
    });

    this.currentFolder = ViewerState.path()!;
  }

  async read() {
    this.noteId = this.partialNote._id;
    this.loading.set(true);
    const noteData = await ServerConnector.readNote(this.partialNote._id);
    this.loading.set(false);

    if (!noteData) {
      this.notFound.set(true);
      return;
    }

    this.path.set(`${this.currentFolder}/${noteData.name}`.replaceAll("//", "/"));
    this.fullNote.set(noteData);
    this.modified.set(false);
  }

  async writeData() {
    this.writing.set(true);

    await ServerConnector?.writeNote(this.partialNote!._id, this.fullNote().data);

    this.fullNote.update((v) => {
      v.updatedAt = new Date().toISOString();

      return v;
    });

    await Sleep(100); // Artificial delay is only here for UX purposes

    this.modified.set(false);
    this.writing.set(false);
  }

  async close() {
    const isModified = this.modified();

    if (!isModified) {
      this.visible.set(false);
      await Sleep(150);

      OpenedState?.closeEditor(this);
      return;
    }

    ShowDialog({
      title: "Save note?",
      message: "Do you want to save this note before closing?",
      buttons: [
        { caption: "Cancel" },
        {
          caption: "Discard",
          action: () => {
            OpenedState?.closeEditor(this);
          },
        },
        {
          caption: "Save",
          action: async () => {
            await this.writeData();
            OpenedState?.closeEditor(this);
          },
          autofocus: true,
        },
      ],
    });
  }
}
