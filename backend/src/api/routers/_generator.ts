import express, { NextFunction, Request, Response, Router } from "express";
import { Method } from "../../types/api";
import { RouteCallback } from "../../types/routes";
import { Logger } from "../../logging";
import { randomUUID } from "crypto";
import { AuthorizationError } from "../auth";

export function RouterGenerator(
  routes: Record<string, RouteCallback>,
  name = "default"
) {
  const router = express.Router();
  const translations = RouterMethodTranslations(router);

  for (const key in routes) {
    const [method, path] = key.split("@") as [Method, string];
    const func = translations?.[method];

    func(path, (req: Request, res: Response, next: NextFunction) => {
      const requestId = randomUUID();
      const start = Date.now();

      Logger.info(`${requestId}: Handling incoming ${path} on router ${name}`);

      const stop = (c = 400) => {
        Logger.error(`${requestId}: STOP => ${c}`);

        res.status(c);
        res.end();

        return "";
      };

      try {
        routes[key]!(req, res, stop, next);
      } catch (e) {
        if (e instanceof AuthorizationError) {
          stop(401);
        } else {
          stop(500);
        }
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

export function RouterMethodTranslations(
  router: Router
): Record<Method, (...args: any[]) => any> {
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

export const Path = (path: string, method: Method = "get") =>
  `${method}@${path}`;
