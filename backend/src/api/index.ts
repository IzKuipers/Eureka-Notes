import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import multer from "multer";
import config from "../../config.json";
import { Logger } from "../logging";
import { Method } from "../types/api";
import { corsOptions } from "./cors";
import errorHandler from "./error/handler";
import { RouteDefinitions as RouterDefinitions } from "./routers/_definitions";
import { trackRequests } from "./tracking";

export class ApiInterface {
  static App = express();
  private static port = config.port;

  static async start(): Promise<ApiInterface> {
    Logger.info("Starting API");

    // 10MB field size max
    this.App.use(
      multer({ limits: { fieldSize: 10 * 1024 ** 2 } }).any(),
      express.json(),
      cors(corsOptions),
      errorHandler,
      cookieParser(),
      trackRequests,
    );

    this.App.options("*", cors(corsOptions));
    this.App.set("trust proxy", true);

    this.assignRouters();

    return new Promise((r) => {
      this.App.listen(this.port, () => {
        Logger.info("Now listening!");

        r(this);
      });
    });
  }

  static assignRouters() {
    Logger.info("Assigning routers");
    for (const path in RouterDefinitions) {
      Logger.info(`Router => ${path}`);

      this.App.use(path, RouterDefinitions[path]);
    }
  }

  static MethodTranslations(): Record<Method, (...args: any[]) => any> {
    return {
      get: this.App.get.bind(this.App),
      post: this.App.post.bind(this.App),
      options: this.App.options.bind(this.App),
      delete: this.App.delete.bind(this.App),
      put: this.App.put.bind(this.App),
      all: this.App.all.bind(this.App),
      patch: this.App.patch.bind(this.App),
      head: this.App.head.bind(this.App),
    };
  }
}
