import type { Component } from "svelte";
import { GlobalModularityState } from "../ts/state/modular";

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

  constructor(id: string) {
    this.id = id;
  }

  close() {
    GlobalModularityState?.DisposeDialog(this.id);
  }
}
