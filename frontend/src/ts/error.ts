import { AxiosError } from "axios";
import { ShowDialog } from "./dialog";

export function globalErrorHandler(e: any) {
  const axiosError = e instanceof AxiosError && (e as AxiosError);

  console.log(axiosError);

  if (axiosError) {
    switch (axiosError.status) {
      case 401:
      case 400:
      case 404:
      case 409:
        console.log(`Not globally notifying non-critical status code '${axiosError.status}'.`);
        break;
      case 500:
      default:
        if (axiosError.code !== "ERR_NETWORK")
          ShowDialog({
            title: "Eureka Error",
            message: `The server encountered an error: ${axiosError.code} ${e}`,
            buttons: [{ caption: "Okay", autofocus: true }],
          });
        break;
    }
  }

  console.warn(e);
}
