import {
  createServer,
  IncomingMessage,
  METHODS,
  Server,
  ServerResponse
} from "http";
import { match } from "path-to-regexp";
import { Scope } from "./scope";
import NotFound from "./status/404";
import {
  IAsyncHandler,
  IAsyncMiddleware,
  IOptions,
  IRoute,
  IRouteItem,
  IScope
} from "./types";

export class Aex {
  // tslint:disable-next-line:variable-name
  private _server?: Server;
  private middlewares: IAsyncMiddleware[] = [];
  private options: IOptions[] = [];
  private routes: IRoute = {};
  private statusHandlers: { [key: string]: IAsyncHandler } = {};
  constructor() {
    this.statusHandlers["404"] = NotFound;
  }

  public use(cb: IAsyncMiddleware) {
    this.middlewares.push(cb);
  }

  get server() {
    return this._server;
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

  public async start(
    port: number = 3000,
    ip: string = "localhost"
  ): Promise<Server> {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        this.routing(req, res).then();
      });

      server.listen(port, ip);
      server.on("error", (error: Error) => {
        reject(error);
      });

      server.on("listening", () => {
        this._server = server;
        resolve(server);
      });
    });
  }

  public prepare() {
    for (const options of this.options) {
      if (!this.routes[options.method]) {
        this.routes[options.method] = {};
      }
      this.routes[options.method][options.url] = {
        handler: options.handler,
        middlewares: options.middlewares
      };
    }
  }

  protected async processMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    middlewares: IAsyncMiddleware[],
    scope?: object
  ): Promise<boolean> {
    for (const middleware of middlewares) {
      const leave = await middleware(req, res, scope);
      // Stop middleware execution when false is returned.
      if (leave === false) {
        return true;
      }
    }
    return false;
  }

  protected async routing(req: IncomingMessage, res: ServerResponse) {
    const url = req.url;
    const method = req.method;
    const scope = new Scope();

    const middlewares = this.middlewares;
    if (middlewares && middlewares.length) {
      const leave = await this.processMiddleware(req, res, middlewares, scope);
      if (leave) {
        return;
      }
    }

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
      }
    });
  }

  protected async requestHandling(
    req: IncomingMessage,
    res: ServerResponse,
    handler: IRouteItem,
    scope: IScope
  ) {
    if (handler.middlewares && handler.middlewares.length) {
      const leave = await this.processMiddleware(
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
export default Aex;
