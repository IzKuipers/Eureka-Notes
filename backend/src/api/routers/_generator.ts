import chalk from "chalk";
import { randomUUID } from "crypto";
import express, { NextFunction, Request, Response, Router } from "express";
import { Logger } from "../../logging";
import { Method } from "../../types/api";
import { RouteCallback } from "../../types/routes";
import config from "../../../config.json";

const { blueBright, greenBright } = chalk;

export function RouterGenerator(routes: Record<string, RouteCallback>, name = "default") {
  const router = express.Router();
  const translations = RouterMethodTranslations(router);

  for (const key in routes) {
    const [method, path] = key.split("@") as [Method, string];
    const func = translations?.[method];

    Logger.info(`${name}: Attaching ${method.toUpperCase()} ${path}`);

    func(path, async (req: Request, res: Response, next: NextFunction) => {
      const requestId = randomUUID();
      const start = Date.now();

      Logger.info(`${requestId}: Handling incoming ${blueBright(path)} on router ${greenBright(name)}`);

      const stop = (c = 400, json?: object) => {
        Logger.info(`${requestId}: STOP => ${c}`);

        try {
          if (json) {
            res.status(c).json(json);
          } else {
            res.status(c).end();
          }

          return "";
        } catch {
          Logger.warn("STOP failed: may already be terminated.");
          return "";
        }
      };

      try {
        await routes[key]!(req, res, stop, next); // Call the endpoint
      } catch (e) {
        const error = `${e}`;
        if (error.startsWith("AuthorizationError")) {
          stop(401, { error }); // Some authentication thing failed
        } else if (error.startsWith("RequirementError")) {
          stop(400, { error }); // The request was malformed
        } else if (error.startsWith("NotFoundError")) {
          stop(404, { error }); // The resource was not found
        } else if (error.startsWith("ConflictError")) {
          stop(409, { error }); // The resource already exists
        } else {
          stop(500, { error }); // Assume that a server error occurred if the error class isn't created by us
        }

        if (config.verbose) console.error(e);

        Logger.error(`${requestId}: ${e}`);
      } finally {
        const end = Date.now() - start;
        Logger.info(`${requestId}: done (${end}ms)`);
      }

      return;
    });
  }

  return router;
}

export function RouterMethodTranslations(router: Router): Record<Method, (...args: any[]) => any> {
  return {
    get: router.get.bind(router),
    post: router.post.bind(router),
    options: router.options.bind(router),
    delete: router.delete.bind(router),
    put: router.put.bind(router),
    all: router.all.bind(router),
    patch: router.patch.bind(router),
    head: router.head.bind(router),
  };
}

export const Path = (path: string, method: Method = "get") => `${method}@${path}`;

// Filler methods to make route definitions cleaner

export const POST = (path: string) => `post@${path}`;
export const GET = (path: string) => `get@${path}`;
export const PUT = (path: string) => `put@${path}`;
export const PATCH = (path: string) => `patch@${path}`;
export const DELETE = (path: string) => `delete@${path}`;
export const ALL = (path: string) => `all@${path}`;
