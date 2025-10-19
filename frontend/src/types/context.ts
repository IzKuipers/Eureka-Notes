export interface ContextMenuItem {
  caption: string;
  disabled?: () => boolean;
  active?: () => boolean;
  action?: () => any | Promise<any>;
  separator?: boolean;
}

export const SEP_ITEM: ContextMenuItem = { separator: true, caption: "" };
export type ContextMenuPopulation = ContextMenuItem[];

export interface CurrentContextMenu {
  x: number;
  y: number;
  show: boolean;
  items: ContextMenuPopulation;
}
