import { Application } from "express";
// tslint:disable-next-line:no-duplicate-imports
import { Request, Response } from "express";
import methods from "./methods";
import { createServer, Server } from "http";

// tslint:disable-next-line:no-var-requires
const express = require("express");

export type IAsyncMiddleware = (
  req: Request,
  res: Response
) => Promise<boolean | undefined | null | void>;

export type IAsyncHandler = IAsyncMiddleware;

export interface IRouteItem {
  handler: IAsyncHandler;
  middlewares?: IAsyncMiddleware[];
}

export interface IRoute {
  [key: string]: { [key: string]: IRouteItem };
}

export interface IOptions {
  method: string;
  url: string;
  handler: IAsyncHandler;
  middlewares?: IAsyncMiddleware[];
}

export class Aex {
  // tslint:disable-next-line:variable-name
  private _app: Application;
  // tslint:disable-next-line:variable-name
  private _server?: Server;
  private middlewares: IAsyncMiddleware[] = [];
  private options: IOptions[] = [];
  private routes: IRoute = {};
  constructor(app?: Application) {
    this._app = app ? app : express();
  }

  public use(cb: IAsyncMiddleware) {
    this.middlewares.push(cb);
  }

  get app() {
    return this._app;
  }

  get server() {
    return this._server;
  }

  public handle(options: IOptions): boolean {
    if (methods.indexOf(options.method) === -1) {
      throw new Error(
        "wrong method: " + options.method + " with url: " + options.url
      );
    }
    this.options.push(options);
    return true;
  }

  public async start(
    port: number = 3000,
    ip: string = "localhost"
  ): Promise<Server> {
    return new Promise((resolve, reject) => {
      const server = createServer(this._app);

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

    // preparse middlewares
    this._app.use((req: Request, res: Response, next: () => void) => {
      this.processMiddleware(req, res, this.middlewares).then(leave => {
        if (leave) {
          return;
        }
        next();
      });
    });

    // Binding routes
    for (const method of Object.keys(this.routes)) {
      for (const url of Object.keys(this.routes[method])) {
        this.bind(method, url, this.routes[method][url]);
      }
    }
  }

  protected processMiddleware(
    req: Request,
    res: Response,
    middlewares: IAsyncMiddleware[]
  ): Promise<boolean> {
    return (async () => {
      for (const middleware of middlewares) {
        const leave = await middleware(req, res);
        // Stop middleware execution when false is returned.
        if (leave === false) {
          return true;
        }
      }
      return false;
    })();
  }

  protected bind(method: string, url: string, handler: IRouteItem) {
    const od = Object.getOwnPropertyDescriptor(this.app, method);
    const func = od!.value;
    func.bind(this._app)(url, (req: Request, res: Response) => {
      (async () => {
        if (handler.middlewares && handler.middlewares.length) {
          const leave = await this.processMiddleware(
            req,
            res,
            handler.middlewares
          );
          if (leave) {
            return true;
          }
        }
        await handler.handler(req, res);
        return false;
      })().then();
    });
  }
}
export default Aex;
