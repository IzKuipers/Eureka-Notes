import type { ModularDialog } from "../../types/dialog";
import { Sleep } from "../sleep";
import { UUID } from "../uuid";
import { Store } from "../writable";

export class ModularDialogState {
  public static store = Store<Map<string, ModularDialog>>(new Map([]));

  public static async ShowDialog(dialog: typeof ModularDialog, ...props: any[]) {
    const uuid = UUID();
    const instance = new dialog(uuid, ...props);
    const allowOpen = await instance.openCondition(...props);

    if (!allowOpen) return;

    this.store.update((v) => {
      v.set(uuid, instance);
      return v;
    });

    await Sleep(10);
    instance.visible.set(true);

    instance.onOpen();
    return instance;
  }

  public static DisposeDialog(id: string) {
    const dialog = this.store().get(id);
    if (!dialog) return;

    dialog.visible.set(false);
    setTimeout(() => {
      this.store.update((v) => {
        v.delete(id);
        return v;
      });
    }, 100);
  }

  static IsOpen(dialog: typeof ModularDialog) {
    return !![...this.store()].find(([_, v]) => v instanceof dialog);
  }
}
