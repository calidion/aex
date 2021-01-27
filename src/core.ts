import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { One } from "./decorators/one";
import { Scope } from "./scope";
import NotFound from "./status/404";
import { IAsyncMiddleware } from "./types";
import { processMiddleware } from "./util";

export class Aex {
  // tslint:disable-next-line:variable-name
  private _server?: Server;
  private _controllers: any[] = [];
  private _controllerInstances: any[] = [];
  private middlewares: IAsyncMiddleware[] = [];
  private scope = new Scope();

  public use(cb: IAsyncMiddleware) {
    this.middlewares.push(cb);
  }

  get server() {
    return this._server;
  }

  /**
   * push a controller to aex
   * @param aClass
   */
  public push(aClass: any) {
    this._controllers.push(aClass);
  }

  /**
   * prepare the web server
   */
  public prepare() {
    // prepare middlewares
    const router = One.instance();
    this.use(router.toMiddleware());
    // prepare handlers
    for (const controller of this._controllers) {
      this._controllerInstances.push(new controller());
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
      const server = createServer((req: any, res: any) => {
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

  protected async routing(req: IncomingMessage, res: ServerResponse) {
    const scope: Scope = Object.create(this.scope);
    scope.reset();

    const middlewares = this.middlewares;
    if (middlewares && middlewares.length) {
      await processMiddleware(req, res, middlewares, scope);
    } else {
      await NotFound(res);
    }
  }
}
export default Aex;
