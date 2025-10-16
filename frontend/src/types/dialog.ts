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
