import type { KeyboardAccelerator } from "../../types/keyboard";

export let GlobalKeyboardState: KeyboardState | undefined;

export class KeyboardState {
  accelerators: KeyboardAccelerator[] = [];

  constructor() {
    GlobalKeyboardState = this;
  }

  initialize() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        return false;
      }

      for (const accelerator of this.accelerators) {
        const alt = accelerator.alt ? !!e.altKey : true;
        const shift = accelerator.shift ? !!e.shiftKey : true;
        const ctrl = accelerator.ctrl ? !!e.ctrlKey : true;
        const key = accelerator.key ? e.key.toLowerCase() === accelerator.key : true;

        if (alt && shift && ctrl && key) accelerator.action(e);
      }
    });
  }

  loadAccelerator(accelerator: string, description: string, action: (e: KeyboardEvent) => void) {
    const result: KeyboardAccelerator = {
      action,
      description,
      display: accelerator,
    };

    const split = accelerator.toLowerCase().split("-");
    for (const key of split) {
      switch (key) {
        case "alt":
          result.alt = true;
          break;
        case "shift":
          result.shift = true;
          break;
        case "ctrl":
          result.ctrl = true;
          break;
        default:
          if (!result.key) result.key = key;
          break;
      }
    }

    if (result.key || result.shift || result.ctrl || result.alt) this.accelerators.push(result);
  }
}
