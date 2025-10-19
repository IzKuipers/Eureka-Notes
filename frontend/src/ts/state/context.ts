import type { ContextMenuPopulation, CurrentContextMenu } from "../../types/context";
import { Store } from "../writable";

export let GlobalContextMenuState: ContextMenuState | undefined;

export class ContextMenuState {
  private readonly DEFAULT_CURRENT: CurrentContextMenu = {
    x: -100,
    y: -100,
    items: [],
    show: false,
  };
  current = Store<CurrentContextMenu>(this.DEFAULT_CURRENT);

  constructor() {
    GlobalContextMenuState = this;

    document.addEventListener("click", (e) => {
      const menu = document.querySelector(".context-menu");
      const composed = e.composedPath();

      if (menu && composed.includes(menu)) return;

      this.hideMenu();
    });

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  showMenu(x: number, y: number, items: ContextMenuPopulation) {
    this.current.set({
      x,
      y,
      items,
      show: true,
    });
  }

  hideMenu() {
    this.current.set(this.DEFAULT_CURRENT);
  }
}

export function contextMenu(node: HTMLElement, items: ContextMenuPopulation) {
  node.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const { clientX, clientY } = e;
    GlobalContextMenuState?.showMenu(clientX, clientY, items);
  });
}
