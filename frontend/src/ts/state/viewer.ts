import { DeleteNotesDialog } from "../../dialogs/DeleteNotes/DeleteNotes";
import { ImportNotesDialog } from "../../dialogs/ImportNotes/ImportNotes";
import { MoveFolderDialog } from "../../dialogs/MoveFolder/MoveFolder";
import { MoveNotesDialog } from "../../dialogs/MoveNotes/MoveNotes";
import { RenameFolderDialog } from "../../dialogs/RenameFolder/RenameFolder";
import { RenameNoteDialog } from "../../dialogs/RenameNote/RenameNote";
import type { ExistingEurekaFolder, FolderRead } from "../../types/folder";
import type { PartialEurekaNote } from "../../types/note";
import { GlobalServerConnector } from "../api";
import { Connected, Connecting, LoggedIn } from "../api/stores";
import { BlockingOkay, ShowDialog } from "../dialog";
import { Store } from "../writable";

export let GlobalViewerState: ViewerState | undefined;
export const ViewerReady = Store<boolean>(false);

export class ViewerState {
  private readonly START_PATH: string;
  private readonly DEFAULT_STATUS = "Ready.";
  public path = Store<string>();
  public read = Store<FolderRead | undefined>();
  public loading = Store<boolean>(false);
  public status = Store<string>();
  public selection = Store<PartialEurekaNote[]>([]);
  public maxZIndex = Store<number>(1);

  constructor(startPath = "") {
    this.path.set(startPath);
    GlobalViewerState = this;
    this.START_PATH = startPath;
  }

  async initialize() {
    Connecting.set(false);
    if (!Connected() || !LoggedIn()) return;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        console.log("TAB KEY!");
        e.preventDefault();
        return false;
      }
    });

    this.reset();
    await this.navigate(this.path(), true);
    ViewerReady.set(true);
  }

  async navigate(path: string, force = false): Promise<boolean> {
    if (this.path() === path && !force) return false;

    this.loading.set(true);
    const newContent = await GlobalServerConnector?.readFolderByPath(path);

    if (!newContent) {
      await this.FolderNotFound();
      this.loading.set(false);
      return false;
    }

    this.selection.set([]);
    this.read.set(newContent);
    this.loading.set(false);
    this.path.set(path);

    return true;
  }

  async refresh() {
    return await this.navigate(this.path(), true);
  }

  reset() {
    this.read.set(undefined);
    this.path.set(this.START_PATH);
    this.loading.set(false);
    this.resetStatus();
  }

  async FolderNotFound() {
    await BlockingOkay("Folder not found", "The specified folder could not be found. Please check the path and try again.");
  }

  setStatus(status: string) {
    this.status.set(status);
  }

  resetStatus() {
    this.status.set(this.DEFAULT_STATUS);
  }

  deleteSelection(notes = this.selection()) {
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
              await GlobalServerConnector?.deleteNote(notes[0]._id);
              await this.refresh();
            } else {
              DeleteNotesDialog.Invoke(...notes);
            }
          },
        },
      ],
    });
  }

  renameSelection() {
    if (this.selection().length !== 1) return;

    const note = this.selection()[0];

    if (!note) return;

    RenameNoteDialog.Invoke(note);
  }

  renameFolder(folder: ExistingEurekaFolder) {
    RenameFolderDialog.Invoke(folder);
  }

  deleteFolder(folder: ExistingEurekaFolder) {
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
            await GlobalServerConnector?.deleteFolder(folder._id);
            await GlobalViewerState?.refresh();
          },
        },
      ],
    });
  }

  moveFolder(folder: ExistingEurekaFolder) {
    MoveFolderDialog.Invoke(folder);
  }

  moveSelection() {
    if (!this.selection().length) return;

    MoveNotesDialog.Invoke(...this.selection());
  }

  importNotes() {
    ImportNotesDialog.Invoke();
  }
}
