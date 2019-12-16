import { IncomingMessage, METHODS, ServerResponse } from "http";
import { match } from "path-to-regexp";
import Aex from "./core";
import { Scope } from "./scope";
import NotFound from "./status/404";
import { IOptions, IRoute, IRouteItem } from "./types";
import { processMiddleware } from "./util";

export class Router {
  private options: IOptions[] = [];
  private routes: IRoute = {};

  private aex: Aex;

  constructor(aex: Aex) {
    this.aex = aex;
  }

  public handle(options: IOptions): boolean {
    const method = options.method.toUpperCase();
    if (METHODS.indexOf(method) === -1) {
      throw new Error(
        "wrong method: " + options.method + " with url: " + options.url
      );
    }
    options.method = options.method.toUpperCase();
    this.options.push(options);
    return true;
  }

  public prepare() {
    for (const options of this.options) {
      if (!this.routes[options.method]) {
        this.routes[options.method] = {};
      }
      this.routes[options.method][options.url] = {
        handler: options.handler,
        middlewares: options.middlewares,
      };
    }
    this.aex.use(async (req, res, scope) => {
      await this.routing(req, res, scope);
    });
  }

  protected async routing(
    req: IncomingMessage,
    res: ServerResponse,
    scope?: Scope
  ) {
    const url = req.url;
    const method = req.method;

    const router = this.getMatchedRouter(method as string, url as string);
    if (!router) {
      await NotFound(req, res);
      return;
    }
    if (router.matched && Object.keys(router.matched.params).length) {
      this.enhanceRequest(req, router.matched.params);
    }
    await this.requestHandling(req, res, router.handler, scope);
  }

  protected getMatchedRouter(method: string, url: string) {
    const routes = this.routes[method];
    if (!routes) {
      return;
    }
    const handler = routes[url];
    if (handler) {
      return { handler };
    }
    const keys = Object.keys(routes);
    for (const key of keys) {
      const matcher = match(key, { decode: decodeURIComponent });
      const matched = matcher(url);
      if (matched) {
        return { matched, handler: routes[key] };
      }
    }
    return;
  }

  protected enhanceRequest(req: IncomingMessage, params: object) {
    Object.defineProperty(req, "params", {
      enumerable: true,
      get: () => {
        return params;
      },
    });
  }

  protected async requestHandling(
    req: IncomingMessage,
    res: ServerResponse,
    handler: IRouteItem,
    scope?: Scope
  ) {
    if (handler.middlewares && handler.middlewares.length) {
      const leave = await processMiddleware(
        req,
        res,
        handler.middlewares,
        scope
      );
      if (leave) {
        return true;
      }
    }

    await handler.handler(req, res, scope);
    return false;
  }
}
