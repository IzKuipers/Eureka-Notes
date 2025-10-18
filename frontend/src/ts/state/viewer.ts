import type { FolderRead } from "../../types/folder";
import type { PartialEurekaNote } from "../../types/note";
import { GlobalServerConnector } from "../api";
import { Connected, Connecting, LoggedIn } from "../api/stores";
import { BlockingOkay } from "../dialog";
import { Store } from "../writable";

export let GlobalViewerState: ViewerState | undefined;
export const ViewerReady = Store<boolean>(false);

export class ViewerState {
  private readonly START_PATH: string;
  private readonly DEFAULT_STATUS = "Press TAB to create a note";
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
    const newContent = await GlobalServerConnector?.readFolder(path);

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
}
