import type { Component } from "svelte";
import { ModularDialog, type DialogButton } from "../../types/dialog";
import KeyboardShortcuts from "./KeyboardShortcuts.svelte";

export class KeyboardShortcutsDialog extends ModularDialog {
  override className = "keyboard-shortcuts";
  override component = KeyboardShortcuts as Component;
  override buttons: DialogButton[] = [
    {
      caption: "Close",
      action: () => this.close(),
    }
  ];

  
}