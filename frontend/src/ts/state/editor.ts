import { GlobalViewerState } from "./viewer";
import type { ExistingEurekaNote, PartialEurekaNote } from "../../types/note";
import { GlobalServerConnector } from "../api";
import { ShowDialog } from "../dialog";
import { Store } from "../writable";
import { GlobalOpenedState } from "./opened";
import { Sleep } from "../sleep";

export class EditorState {
  partialNote: PartialEurekaNote;
  noteId?: string;
  fullNote = Store<ExistingEurekaNote>();
  notFound = Store<boolean>(false);
  loading = Store<boolean>(false);
  writing = Store<boolean>(false);
  collapsed = Store<boolean>(false);
  modified = Store<boolean>(false);
  path = Store<string>();

  constructor(partial: PartialEurekaNote) {
    this.partialNote = partial;

    this.fullNote.subscribe(() => {
      this.modified.set(true);
      GlobalViewerState?.status.set(`Editing ${this.partialNote?.name}`);
    });
  }

  async read() {
    this.noteId = this.partialNote._id;
    this.loading.set(true);
    const noteData = await GlobalServerConnector!.readNote(this.partialNote._id);
    this.loading.set(false);

    if (!noteData) {
      this.notFound.set(true);
      return;
    }

    this.path.set(`${GlobalViewerState?.path()}/${noteData.name}`.replaceAll("//", "/"));
    this.fullNote.set(noteData);
    this.modified.set(false);
  }

  async writeData() {
    this.writing.set(true);

    await GlobalServerConnector?.writeNote(this.partialNote!._id, this.fullNote().data);

    this.fullNote.update((v) => {
      v.modifiedAt = Date.now().toLocaleString();

      return v;
    });

    await Sleep(100); // Artificial delay is only here for UX purposes

    this.modified.set(false);
    this.writing.set(false);
  }

  async close() {
    const isModified = this.modified();

    if (!isModified) {
      GlobalOpenedState?.closeEditor(this);
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
            GlobalOpenedState?.closeEditor(this);
          },
        },
        {
          caption: "Save",
          action: async () => {
            await this.writeData();
            GlobalOpenedState?.closeEditor(this);
          },
        },
      ],
    });
  }
}
