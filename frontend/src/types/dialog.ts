import type { Component } from "svelte";
import { GlobalModularityState } from "../ts/state/modular";
import { Store } from "../ts/writable";

export interface DialogOptions {
  title: string;
  message: string;
  buttons: DialogButton[];
  icon?: string;
}

export interface DialogButton {
  caption: string;
  action?: () => Promise<void> | void;
  className?: string;
  autofocus?: boolean;
}

export class ModularityDialogInstance {
  private id: string;
  public component?: Component<{ dialog: ModularityDialogInstance }>;
  public className?: string;
  public buttons: DialogButton[] = [];
  public loading = Store<boolean>(false);
  public disabledButtons = Store<number[]>();
  protected props;

  constructor(id: string, ...props: any[]) {
    this.id = id;
    this.props = props;
  }

  async openCondition(...props: any[]): Promise<boolean> {
    /** */
    return true;
  }

  onClose() {
    /** */
  }

  onOpen() {
    /** */
  }

  close() {
    this.onClose();
    GlobalModularityState?.DisposeDialog(this.id);
  }

  static async Invoke<T extends ModularityDialogInstance>(
    this: new (...args: any[]) => T,
    ...args: any[]
  ): Promise<T | undefined> {
    return (await GlobalModularityState?.ShowDialog(this as any, ...args)) as T | undefined;
  }

  getDialog() {
    return document.querySelector<HTMLDivElement>(`.dialog[id="${this.id}"]`);
  }

  disableButton(idx: number) {
    this.disabledButtons.update((v) => {
      if (v.includes(idx)) return v;

      v.push(idx);

      return v;
    });
  }

  enableButton(idx: number) {
    this.disabledButtons.update((v) => {
      if (!v.includes(idx)) return v;

      v.splice(v.indexOf(idx), 1);

      return v;
    });
  }
}
