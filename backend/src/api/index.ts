import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import multer from "multer";
import { Method } from "../types/api";
import { corsOptions } from "./cors";
import errorHandler from "./error";
import { RouteDefinitions as RouterDefinitions } from "./routers/_definitions";
import { trackRequests } from "./tracking";
import { Logger } from "../logging";

export let GlobalApiInstance: ApiInterface | undefined;

export class ApiInterface {
  App = express();

  constructor(
    private port = 3141,
    private routerDefinitions = RouterDefinitions
  ) {
    Logger.info("Constructing API");

    this.App.use(
      multer().any(),
      express.json(),
      cors(corsOptions),
      errorHandler,
      cookieParser(),
      trackRequests
    );
  }

  async start(): Promise<ApiInterface> {
    Logger.info("Starting API");

    this.App.options("*", cors(corsOptions));
    this.App.set("trust proxy", true);

    GlobalApiInstance = this;

    this.assignRouters();

    return new Promise((r) => {
      this.App.listen(this.port, () => {
        Logger.info("Now listening!");

        r(this);
      });
    });
  }

  assignRouters() {
    Logger.info("Assigning routers");
    for (const path in this.routerDefinitions) {
      Logger.info(`Router => ${path}`);

      this.App.use(path, RouterDefinitions[path]);
    }
  }

  MethodTranslations(): Record<Method, (...args: any[]) => any> {
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
