import { AxiosError } from "axios";
import { ShowDialog } from "./dialog";
import { GlobalServerConnector } from "./api";

export function globalErrorHandler(e: any) {
  const axiosError: AxiosError | false = e instanceof AxiosError && (e as AxiosError);

  if (axiosError) {
    const data = axiosError.response?.data as { error?: string } | undefined;

    // If the token has expired
    if (data?.error?.startsWith("AuthorizationError") && data?.error?.includes("Invalid token")) {
      ShowDialog({
        title: "Login expired",
        message: "Your token has expired because you didn't use eureka for too long. Please log in again.",
        buttons: [
          {
            caption: "Reload",
            action: () => {
              GlobalServerConnector?.resetCookies()
              location.reload();
            },
          },
        ],
      });

      throw "";
    }

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
}
