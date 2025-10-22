import type { Component } from "svelte";
import { ModularityDialogInstance, type DialogButton } from "../../types/dialog";
import About from "./About.svelte";

export class AboutDialog extends ModularityDialogInstance {
  override buttons: DialogButton[] = [
    {
      caption: "Okay",
      action: () => this.close(),
      autofocus: true,
      className: "red",
    },
  ];
  override className = "about-dialog";
  override component = About as Component;
}
