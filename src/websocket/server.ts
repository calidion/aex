import { EventEmitter } from "events";
import { IncomingMessage, Server } from "http";
import * as WebSocket from "ws";
import { Scope } from '../scope';
import { IWebSocketAsyncMiddleware } from "../types";
import { processWebSocketMiddleware } from "../util";
import { MessageHandler } from './handler';

export class WebSocketServer extends EventEmitter {
  public static ENTER = "enter";
  public static LEAVE = "leave";
  public static CLOSE = "close";
  public static UPGRADE = "upgrade";
  public static CONNECTION = "connection";

  private server: WebSocket.Server;

  private middlewares: IWebSocketAsyncMiddleware[] = [];
  private scope = new Scope();

  constructor(server: Server) {
    super();
    this.server = new WebSocket.Server({ server });
    this.server.on(
      WebSocketServer.CONNECTION,
      async (ws: WebSocket, req: IncomingMessage, head: any) => {
        const scope: Scope = Object.create(this.scope);
        scope.time.reset();
        scope.outer.ws = ws;
        scope.outer.req = req;
        const middlewares = this.middlewares;
        if (middlewares.length) {
          if (await processWebSocketMiddleware(middlewares, req, ws, scope) === false) {
            return;
          }
        }
        this.onEnter(scope);
        this.onLeave(ws, req, head);
      }
    );
  }

  public use(cb: IWebSocketAsyncMiddleware) {
    this.middlewares.push(cb);
  }

  public close() {
    this.server.close();
  }

  public onEnter(scope: Scope) {
    const messager = new MessageHandler(scope);
    this.emit(WebSocketServer.ENTER, messager);
  }

  public onLeave(ws: WebSocket, req: IncomingMessage, head: any) {
    ws.on(WebSocketServer.CLOSE, () => {
      this.emit(WebSocketServer.ENTER, ws, req, head);
    });
  }
}
