import { IncomingMessage, METHODS, ServerResponse } from "http";
import { match } from "path-to-regexp";
import { Scope } from "./scope";
import NotFound from "./status/404";
import {
  IAsyncHandler,
  IAsyncMiddleware,
  IOptions,
  IRoute,
  IRouteItem,
} from "./types";
import { processMiddleware } from "./util";

interface IBuildIns {
  options: IOptions[];
  routes: IRoute;
}

export class Router {
  private buildins: IBuildIns = {
    options: [],
    routes: {},
  };
  [x: string]: any;

  constructor() {
    for (const method of METHODS) {
      Object.defineProperty(this, method.toLowerCase(), {
        enumerable: true,
        value: (
          url: string | string[],
          handler: IAsyncHandler,
          middlewares?: IAsyncMiddleware[]
        ) => {
          const options: IOptions = {
            handler,
            method,
            middlewares,
            url,
          };
          this.handle(options);
        },
      });
    }
  }

  public handle(options: IOptions) {
    const method = options.method.toUpperCase();
    if (METHODS.indexOf(method) === -1) {
      throw new Error(
        "wrong method: " + options.method + " with url: " + options.url
      );
    }
    options.method = options.method.toUpperCase();
    this.buildins.options.push(options);
  }

  public prepare() {
    for (const options of this.buildins.options) {
      if (!this.buildins.routes[options.method]) {
        this.buildins.routes[options.method] = {};
      }
      if (typeof options.url === "string") {
        this.buildins.routes[options.method][options.url] = {
          handler: options.handler,
          middlewares: options.middlewares,
        };
      }
      if (options.url instanceof Array) {
        for (const url of options.url) {
          this.buildins.routes[options.method][url] = {
            handler: options.handler,
            middlewares: options.middlewares,
          };
        }
      }
    }
  }

  public toMiddleware() {
    this.prepare();
    return async (req: IncomingMessage, res: ServerResponse, scope?: Scope) => {
      this.run(req, res, scope);
    };
  }

  public async run(req: IncomingMessage, res: ServerResponse, scope?: Scope) {
    let url = req.url as string;
    url = url.split("?")[0];
    const method = req.method;

    const router = this.getMatchedRouter(method as string, url as string);
    if (!router) {
      await NotFound(res);
      return;
    }
    if (router.matched && Object.keys(router.matched.params).length) {
      this.enhanceRequest(req, router.matched.params);
    }
    await this.requestHandling(req, res, router.handler, scope);
  }

  protected getMatchedRouter(method: string, url: string) {
    const routes = this.buildins.routes[method];
    if (!routes) {
      return;
    }
    const handler = routes[url];
    if (handler) {
      return { handler };
    }
    const keys = Object.keys(routes);
    for (const key of keys) {
      if (key === "*") {
        return { matched: { params: {} }, handler: routes["*"] };
      }
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
