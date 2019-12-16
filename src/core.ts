import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { Scope } from "./scope";
import NotFound from "./status/404";
import { IAsyncMiddleware } from "./types";
import { processMiddleware } from "./util";

export class Aex {
  // tslint:disable-next-line:variable-name
  private _server?: Server;
  private middlewares: IAsyncMiddleware[] = [];
  private scope = new Scope();

  public use(cb: IAsyncMiddleware) {
    this.middlewares.push(cb);
  }

  get server() {
    return this._server;
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

  protected async routing(req: IncomingMessage, res: ServerResponse) {
    const scope: Scope = Object.create(this.scope);
    scope.time.reset();

    const middlewares = this.middlewares;
    if (middlewares && middlewares.length) {
      const leave = await processMiddleware(req, res, middlewares, scope);
      if (leave) {
        return;
      }
    } else {
      await NotFound(req, res);
    }
  }
}
export default Aex;
