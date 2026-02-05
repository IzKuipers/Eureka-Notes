import { SharePasswordDialog } from "../../dialogs/SharePasswordDialog/SharePasswordDialog";
import type { ShareReadResponse } from "../../types/share";
import { GlobalServerConnector } from "../api";
import { ShowDialog } from "../dialog";
import type { CommandResult } from "../result";
import { Store } from "../writable";

export let GlobalShareState: ShareState | undefined;

export class ShareState {
  private shareValue: string;
  public shareInfo = Store<ShareReadResponse>();

  constructor(shareId: string) {
    this.shareValue = shareId;

    GlobalShareState = this;
  }

  async initialize(password?: string) {
    const contentResult = await GlobalServerConnector!.readNoteByShareValue(this.shareValue, password);

    console.log(contentResult);

    if (!contentResult?.success) {
      this.handleUnsuccessfulRead(contentResult);
      return;
    }

    this.shareInfo.set(contentResult.result!);
  }

  async handleUnsuccessfulRead(contentResult: CommandResult<ShareReadResponse>) {
    if (contentResult.errorMessage?.includes("password is incorrect")) {
      SharePasswordDialog.Invoke();
    } else {
      ShowDialog({
        title: "Failed to read note",
        message: contentResult.errorMessage ?? "An unknown error occurred whilst trying to open the note.",
        buttons: [
          {
            caption: "Refresh",
            action: () => {
              location.href = location.origin;
            },
          },
        ],
      });
    }
  }
}
