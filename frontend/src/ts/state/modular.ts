import type { ModularityDialogInstance } from "../../types/dialog";
import { UUID } from "../uuid";
import { Store } from "../writable";

export class ModularityState {
  public static store = Store<Map<string, ModularityDialogInstance>>(new Map([]));

  public static async ShowDialog(dialog: typeof ModularityDialogInstance, ...props: any[]) {
    const uuid = UUID();
    const instance = new dialog(uuid, ...props);
    const allowOpen = await instance.openCondition(...props);

    if (!allowOpen) return;

    this.store.update((v) => {
      v.set(uuid, instance);
      return v;
    });

    instance.onOpen();
    return instance;
  }

  public static DisposeDialog(id: string) {
    this.store.update((v) => {
      v.delete(id);
      return v;
    });
  }

  static IsOpen(dialog: typeof ModularityDialogInstance) {
    return !![...this.store()].find(([_, v]) => v instanceof dialog);
  }
}
