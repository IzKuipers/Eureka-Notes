import { ShowDialog } from "./dialog";

export function globalErrorHandler(e: any) {
  ShowDialog({
    title: "Eureka Error",
    message: `${e}`,
    buttons: [{ caption: "Okay" }],
  });
  console.warn(e);
}
