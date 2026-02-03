import type { Component } from "svelte";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import KeyboardShortcuts from "./KeyboardShortcuts.svelte";

export class KeyboardShortcutsDialog extends ModularityDialogInstance {
  override className = "keyboard-shortcuts";
  override component = KeyboardShortcuts as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Close",
      action: () => this.close(),
    }
  ];

  
}