import { SharePasswordDialog } from "../../dialogs/SharePasswordDialog/SharePasswordDialog";
import type { ShareReadResponse } from "../../types/share";
import { GlobalServerConnector } from "../api";
import { BlockingOkay, ShowDialog } from "../dialog";
import type { CommandResult } from "../result";
import { Store } from "../writable";

export let GlobalShareState: ShareState | undefined;

export class ShareState {
  public shareValue: string;
  public shareInfo = Store<ShareReadResponse>();
  public loading = Store<boolean>(true);
  public password?: string;

  constructor(shareId: string) {
    this.shareValue = shareId;

    GlobalShareState = this;
  }

  async initialize(password?: string) {
    this.loading.set(true);
    const contentResult = await GlobalServerConnector!.readNoteByShareValue(this.shareValue, password);

    if (!contentResult?.success) {
      this.handleUnsuccessfulRead(contentResult);
      this.loading.set(false);
      return;
    }

    this.password = password;
    this.shareInfo.set(contentResult.result!);
    this.loading.set(false);
  }

  async handleUnsuccessfulRead(contentResult: CommandResult<ShareReadResponse>) {
    const errorMessage = contentResult.errorMessage ?? "";

    if (errorMessage.includes("password is incorrect")) {
      SharePasswordDialog.Invoke();
    } else if (errorMessage.includes("expired")) {
      await BlockingOkay(
        "Share expired",
        "The share you're trying to access is no longer available. Please ask the author for a new link.",
      );

      location.href = `./`;
    } else if (errorMessage.startsWith("NotFoundError")) {
      await BlockingOkay(
        "Share not found",
        "The share you're trying to access could not be found. Please ask the author for a new link.",
      );

      location.href = `./`;
    } else {
      ShowDialog({
        title: "Failed to read note",
        message: contentResult.errorMessage ?? "An unknown error occurred whilst trying to open the note.",
        buttons: [
          {
            caption: "Refresh",
            action: () => {
              location.href = `./`;
            },
          },
        ],
      });
    }
  }
}
