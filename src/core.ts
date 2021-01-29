/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { One } from "./decorators/one";
import { redirect } from "./response/redirect";
import { Scope } from "./scope";
import NotFound from "./status/404";
import { IAsyncMiddleware } from "./types";
import { processMiddleware } from "./util";

export class Aex {
  get server() {
    return this._server;
  }

  get instances() {
    return this._controllerInstances;
  }

  protected middlewares: IAsyncMiddleware[] = [];
  protected scope = new Scope();
  // tslint:disable-next-line:variable-name
  private _server?: Server;
  private _classes: any[] = [];
  private _controllerInstances: any[] = [];

  public use(cb: IAsyncMiddleware) {
    this.middlewares.push(cb);
  }

  /**
   * push a controller to aex
   * @param aClass
   */
  public push(aClass: any, ...options: any[]) {
    this._classes.push([aClass, options]);
  }

  /**
   * prepare the web server
   */
  public prepare() {
    // prepare middlewares
    const router = One.instance();
    this.use(router.toMiddleware());
    // prepare handlers
    for (const classPair of this._classes) {
      const controller = classPair[0];
      const options = classPair[1];
      this._controllerInstances.push(new controller(...options));
    }
    return this;
  }

  /**
   * start the web server
   *
   * @param port the port taken by the web server, default to 3000
   * @param ip the ip address where the port bind to, default to localhost
   * @param prepare prepare middlewares or not, used when middlewares are not previously prepared
   */

  public async start(
    port: number = 3000,
    ip: string = "localhost",
    prepare: boolean = false
  ): Promise<Server> {
    if (prepare) {
      this.prepare();
    }
    return new Promise((resolve, reject) => {
      const server = createServer(
        (req: IncomingMessage, res: ServerResponse) => {
          this.routing(req, res).then();
        }
      );

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

  protected async routing(req: IncomingMessage, res: ServerResponse) {
    const scope: Scope = Object.create(this.scope);
    scope.reset();

    this.enhanceRes(res);

    const middlewares = this.middlewares;
    if (middlewares && middlewares.length) {
      await processMiddleware(req, res, middlewares, scope);
    } else {
      await NotFound(res);
    }
  }

  protected enhanceRes(res: ServerResponse) {
    redirect(res);
  }
}
export default Aex;
