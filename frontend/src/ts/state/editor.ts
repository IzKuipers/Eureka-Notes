import { GlobalViewerState } from ".";
import type { ExistingEurekaNote, PartialEurekaNote } from "../../types/note";
import { GlobalServerConnector } from "../api";
import { ShowDialog } from "../dialog";
import { UUID } from "../uuid";
import { Store } from "../writable";
import { GlobalOpenedState } from "./opened";

export class EditorState {
  partialNote?: PartialEurekaNote;
  noteId?: string;
  fullNote = Store<ExistingEurekaNote>();
  notFound = Store<boolean>(false);
  loading = Store<boolean>(false);
  writing = Store<boolean>(false);
  collapsed = Store<boolean>(false);
  modified = Store<boolean>(false);
  path = Store<string>();
  // NEW NOTE
  isNew = Store<boolean>(false);
  newData = Store<string>("");
  newName = Store<string>("");
  // END NEW NOTE

  constructor(partial?: PartialEurekaNote) {
    this.partialNote = partial;

    this.fullNote.subscribe(() => {
      this.modified.set(true);
      GlobalViewerState?.status.set(!this.partialNote ? "Creating new note" : `Editing ${this.partialNote?.name}`);
    });
  }

  async read() {
    if (!this.partialNote) {
      this.isNew.set(true);
      this.noteId = `new$${UUID()}`;
      return;
    }

    this.noteId = this.partialNote._id;
    this.loading.set(true);
    const noteData = await GlobalServerConnector!.readNote(this.partialNote._id);
    this.loading.set(false);

    if (!noteData) {
      this.notFound.set(true);
      this.isNew.set(false);
      return;
    }

    this.path.set(`${GlobalViewerState?.path()}/${noteData.name}`.replaceAll("//", "/"));
    this.fullNote.set(noteData);
    this.modified.set(false);
    this.isNew.set(false);
  }

  async writeData() {
    if (this.isNew()) {
      this.writing.set(true);

      const fullNote = await GlobalServerConnector?.createNote(
        this.newName(),
        this.newData(),
        GlobalViewerState!.read()?.folderId
      );
      this.partialNote = fullNote;

      this.writing.set(false);

      return await this.read();
    }

    this.writing.set(true);

    await GlobalServerConnector?.writeNote(this.partialNote!._id, this.fullNote().data);

    this.fullNote.update((v) => {
      v.modifiedAt = Date.now().toLocaleString();

      return v;
    });

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
