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
}

export class ModularityDialogInstance {
  private id: string;
  public component?: Component<{ dialog: ModularityDialogInstance }>;
  public className?: string;
  public buttons: DialogButton[] = [];
  public loading = Store<boolean>(false);
  protected props;

  constructor(id: string, ...props: any[]) {
    this.id = id;
    this.props = props;
  }

  close() {
    GlobalModularityState?.DisposeDialog(this.id);
  }

  static Invoke(...args: any[]) {
    GlobalModularityState?.ShowDialog(this, ...args);
  }
}
