import { DeleteNotesDialog } from "../../dialogs/DeleteNotes/DeleteNotes";
import { ImportNotesDialog } from "../../dialogs/ImportNotes/ImportNotes";
import { KeyboardShortcutsDialog } from "../../dialogs/KeyboardShortcuts/KeyboardShortcuts";
import { MoveFolderDialog } from "../../dialogs/MoveFolder/MoveFolder";
import { MoveNotesDialog } from "../../dialogs/MoveNotes/MoveNotes";
import { NewFolderDialog } from "../../dialogs/NewFolder/NewFolder";
import { NewNoteDialog } from "../../dialogs/NewNote/NewNote";
import { RenameFolderDialog } from "../../dialogs/RenameFolder/RenameFolder";
import { RenameNoteDialog } from "../../dialogs/RenameNote/RenameNote";
import { SearchDialog } from "../../dialogs/SearchDialog/SearchDialog";
import type { ExistingEurekaFolder, FolderRead } from "../../types/folder";
import type { PartialEurekaNote } from "../../types/note";
import { ServerConnector } from "../api";
import { Connected, Connecting, LoggedIn } from "../api/stores";
import { BlockingOkay, ShowDialog } from "../dialog";
import { Store } from "../writable";
import { KeyboardState } from "./keyboard";
import { ModularDialogState } from "./modular";

export const ViewerReady = Store<boolean>(false);

export class ViewerState {
  private static readonly START_PATH: string;
  private static readonly DEFAULT_STATUS = "Ready.";
  private static temporaryStatusTimeout?: number;
  public static path = Store<string>("");
  public static read = Store<FolderRead | undefined>();
  public static loading = Store<boolean>(false);
  public static status = Store<string>();
  public static selection = Store<PartialEurekaNote[]>([]);
  public static maxZIndex = Store<number>(100000000);

  static async initialize() {
    if (import.meta.env.DEV) (window as any).ViewerState = ViewerState;

    Connecting.set(false);
    if (!Connected() || !LoggedIn()) return;

    KeyboardState.loadAccelerator("Alt-N", "Create a new note", () => {
      if (ModularDialogState.IsOpen(NewNoteDialog)) return;
      NewNoteDialog.Invoke();
    });

    KeyboardState.loadAccelerator("Alt-Shift-N", "Create a new folder", () => {
      if (ModularDialogState.IsOpen(NewFolderDialog)) return;
      NewFolderDialog.Invoke();
    });

    KeyboardState.loadAccelerator("Alt-Shift-S", "Search the notes in just this folder", () => {
      if (ModularDialogState.IsOpen(SearchDialog)) return;
      SearchDialog.Invoke(false);
    });

    KeyboardState.loadAccelerator("Alt-S", "Search all of your notes", () => {
      if (ModularDialogState.IsOpen(SearchDialog)) return;
      SearchDialog.Invoke(true);
    });

    KeyboardState.loadAccelerator("Alt-R", "Refresh the folder listing", () => {
      ViewerState.refresh();
    });

    KeyboardState.loadAccelerator("Ctrl-/", "Show keyboard shortcuts", () => {
      if (ModularDialogState.IsOpen(KeyboardShortcutsDialog)) return;
      KeyboardShortcutsDialog.Invoke();
    });

    this.reset();
    await this.navigate(this.path(), true);
    ViewerReady.set(true);
  }

  static async navigate(path: string, force = false): Promise<boolean> {
    if (this.path() === path && !force) return false;

    this.loading.set(true);
    const newContent = await ServerConnector.readFolderByPath(path);

    if (!newContent) {
      await this.FolderNotFound();
      this.loading.set(false);
      return false;
    }

    this.selection.set([]);
    this.read.set(newContent);
    this.loading.set(false);
    this.path.set(path);

    document.title = !path ? `EUREKA` : `${path} - EUREKA`;

    return true;
  }

  static async refresh() {
    return await this.navigate(this.path(), true);
  }

  static reset() {
    this.read.set(undefined);
    this.path.set("")
    this.loading.set(false);
    this.resetStatus();
  }

  static async FolderNotFound() {
    await BlockingOkay("Folder not found", "The specified folder could not be found. Please check the path and try again.");
  }

  static setTemporaryStatus(status: string) {
    clearTimeout(this.temporaryStatusTimeout);

    this.status.set(status);

    this.temporaryStatusTimeout = setTimeout(() => {
      this.resetStatus();
    }, 1000);
  }

  static resetStatus() {
    this.status.set(this.DEFAULT_STATUS);
  }

  static deleteSelection(notes = this.selection()) {
    if (!notes.length) return;

    ShowDialog({
      title: notes.length === 1 ? `Delete note?` : `Delete notes?`,
      message:
        notes.length === 1
          ? `Are you sure you want to delete '${notes[0].name}'? This cannot be undone.`
          : `Are you sure you want to delete these ${notes.length} notes? This cannot be undone.`,
      buttons: [
        {
          caption: "Cancel",
        },
        {
          caption: "Delete",
          action: async () => {
            if (notes.length === 1) {
              await ServerConnector.deleteNote(notes[0]._id);
              await this.refresh();
            } else {
              DeleteNotesDialog.Invoke(...notes);
            }
          },
          autofocus: true,
        },
      ],
    });
  }

  static renameSelection() {
    if (this.selection().length !== 1) return;

    const note = this.selection()[0];

    if (!note) return;

    RenameNoteDialog.Invoke(note);
  }

  static renameFolder(folder: ExistingEurekaFolder) {
    RenameFolderDialog.Invoke(folder);
  }

  static deleteFolder(folder: ExistingEurekaFolder) {
    ShowDialog({
      title: "Delete folder?",
      message: "Are you sure you want to delete this folder? Anything inside of it will also be deleted.",
      buttons: [
        {
          caption: "Cancel",
        },
        {
          caption: "Delete",
          className: "red",
          action: async () => {
            await ServerConnector.deleteFolder(folder._id);
            await ViewerState.refresh();
          },
          autofocus: true,
        },
      ],
    });
  }

  static moveFolder(folder: ExistingEurekaFolder) {
    MoveFolderDialog.Invoke(folder);
  }

  static moveSelection() {
    if (!this.selection().length) return;

    MoveNotesDialog.Invoke(...this.selection());
  }

  static importNotes() {
    ImportNotesDialog.Invoke();
  }

  static async toggleConcealed(note: PartialEurekaNote) {
    const result = await ServerConnector.setNoteConcealed(note._id, !note.conceiled);

    if (result)
      this.read.update((v) => {
        const idx = v?.notes.findIndex((n) => n._id == note._id);
        if (idx == undefined || idx < 0) return v;

        v!.notes[idx].conceiled = !note.conceiled;
        return v;
      });
  }

  static async togglePinned(note: PartialEurekaNote) {
    const result = await ServerConnector.setNotePinned(note._id, !note.pinned);

    if (result)
      this.read.update((v) => {
        const idx = v?.notes.findIndex((n) => n._id == note._id);
        if (idx == undefined || idx < 0) return v;

        v!.notes[idx].pinned = !note.pinned;
        return v;
      });
  }

  static async toggleConcealedFolder(folder: ExistingEurekaFolder) {
    const result = await ServerConnector.setFolderConcealed(folder._id, !folder.conceiled);

    if (result)
      this.read.update((v) => {
        const idx = v?.folders.findIndex((n) => n._id == folder._id);
        if (idx == undefined || idx < 0) return v;

        v!.folders[idx].conceiled = !folder.conceiled;
        return v;
      });
  }
}
