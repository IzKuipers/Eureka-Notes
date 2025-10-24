import type { Component } from "svelte";
import { GlobalServerConnector } from "../../ts/api";
import { BlockingOkay } from "../../ts/dialog";
import { GlobalViewerState } from "../../ts/state/viewer";
import { Store } from "../../ts/writable";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import ImportNotes from "./ImportNotes.svelte";

export class ImportNotesDialog extends ModularityDialogInstance {
  public Done = Store<number>(0);
  public Total = Store<number>(100);
  public Skipped = Store<number>(0);
  public Errors = Store<number>(0);
  public Status = Store<string>("Ready.");
  public Working = Store<boolean>(false);
  override component = ImportNotes as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Cancel",
    },
    {
      caption: "Begin import",
      action: () => this.begin(),
      autofocus: true,
    },
  ];
  override className = "import-notes";

  async begin() {
    return new Promise<void>((resolve) => {
      const input = document.createElement("input");
      const folderId = GlobalViewerState?.read()?.folderId;
      input.type = "file";
      input.accept = "text/plain";
      input.multiple = true;
      input.click();

      input.addEventListener("cancel", () => this.close());

      input.addEventListener("change", async () => {
        const files = input.files;

        if (!files?.length) {
          await BlockingOkay("Import failed", "Eureka didn't receive any files. The import has been aborted.");
          this.close();
          return;
        }

        this.Working.set(true);
        this.Total.set(files.length);

        for (const file of files) {
          const skip = () => {
            this.Skipped.set(this.Skipped() + 1);
            this.Done.set(this.Done() + 1);
          };

          if (file.type !== "text/plain") {
            skip();
            continue;
          }

          this.Status.set(`Importing ${file.name}`);
          const text = await file.text();

          // above 10mb? then don't do it lmfao
          if (text.length > 10 * 1024 ** 2) {
            skip();
            continue;
          }

          const created = await GlobalServerConnector?.createNote(file.name.replace(".txt", ""), text, folderId, false);

          if (!created) this.Errors.set(this.Errors() + 1);

          this.Done.set(this.Done() + 1);
        }

        if (this.Skipped() > 0) {
          await BlockingOkay(
            "Import incomplete",
            `Eureka didn't import ${this.Skipped()} of ${this.Total()} note(s). They might not be plain text documents, or they're above 10mb in size.`
          );
        }

        if (this.Errors() > 0) {
          await BlockingOkay(
            "Import incomplete",
            `Eureka failed to import ${this.Errors()} note(s). Notes with matching names might already exist in this folder.`
          );
        }

        this.Status.set("Finishing up...");

        await GlobalViewerState?.refresh();

        resolve();
        this.close();
        this.Working.set(false);
      });
    });
  }

  onOpen(): void {
    GlobalViewerState?.setTemporaryStatus("Importing notes");
  }

  onClose(): void {
    GlobalViewerState?.resetStatus();
  }
}
