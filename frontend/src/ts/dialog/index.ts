import type { DialogOptions } from "../../types/dialog";
import { UUID } from "../uuid";
import { Store } from "../writable";

export const Dialogs = Store<Map<string, DialogOptions>>(new Map([]));

export function ShowDialog(options: DialogOptions) {
  options.icon ||= "octagon-alert";
  const uuid = UUID();
  Dialogs.update((v) => {
    v.set(uuid, options);
    return v;
  });
}

export function DisposeDialog(id: string) {
  Dialogs.update((v) => {
    v.delete(id);
    return v;
  });
}

export async function Confirmation(title: string, message: string, icon = "octagon-alert"): Promise<boolean> {
  return new Promise((r) => {
    ShowDialog({
      title,
      message,
      icon,
      buttons: [
        { caption: "No", action: () => r(false) },
        { caption: "Yes", action: () => r(true), className: "red" },
      ],
    });
  });
}

export async function BlockingOkay(title: string, message: string, icon = "octagon-alert"): Promise<void> {
  return new Promise((r) => {
    ShowDialog({
      title,
      message,
      icon,
      buttons: [{ caption: "Okay", action: () => r() }],
    });
  });
}
