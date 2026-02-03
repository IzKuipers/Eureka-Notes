import type { ModularityDialogInstance } from "../../types/dialog";
import { UUID } from "../uuid";
import { Store } from "../writable";

export let GlobalModularityState: ModularityState | undefined;

export class ModularityState {
  public store = Store<Map<string, ModularityDialogInstance>>(new Map([]));

  constructor() {
    GlobalModularityState = this;
  }

  public ShowDialog(dialog: typeof ModularityDialogInstance, ...props: any[]) {
    const uuid = UUID();
    const instance = new dialog(uuid, ...props);

    this.store.update((v) => {
      v.set(uuid, instance);
      return v;
    });

    instance.onOpen();
    return instance;
  }

  public DisposeDialog(id: string) {
    this.store.update((v) => {
      v.delete(id);
      return v;
    });
  }

  IsOpen(dialog: typeof ModularityDialogInstance) {
    return !![...this.store()].find(([_, v]) => v instanceof dialog);
  }
}
