import * as debug from "debug";
import { EventEmitter } from "events";
import { IncomingMessage, Server } from 'http';
import { Socket } from "net";
import * as WebSocket from "ws";
import { Scope } from './scope';
import { IAsyncWebSocketMiddleware } from './types';
import { processWebSocketMiddleware } from "./util";

const print = debug("aex:websocket");




export class WebSocketServer extends EventEmitter {

  public static ENTER = "enter";
  public static LEAVE = "leave";
  public static ERROR = "error";
  public static CLOSE = "close";
  public static UPGRADE = "upgrade";
  public static CONNECTION = "connection";
  public static MESSAGE = "message";

  private server?: WebSocket.Server;

  private middlewares: IAsyncWebSocketMiddleware[] = [];
  private scope = new Scope();

  constructor() {
    super();
  }


  public use(cb: IAsyncWebSocketMiddleware) {
    this.middlewares.push(cb);
  }

  public close() {
    this.server?.close();
  }

  public onMessage(ws: WebSocket, scope: Scope) {
    ws.on(WebSocketServer.MESSAGE, (data: Buffer) => {
      try {
        const message = JSON.parse(String(data));
        message.scope = scope;
        this.emit(message.event, message.data);
      } catch (e) {
        print(e);
        this.emit(WebSocketServer.ERROR, { message: "JSON format error!", raw: String(data) });
      }
    });
  }

  public onEnter(ws: WebSocket, req: IncomingMessage, head: any) {
    this.emit(WebSocketServer.ENTER, ws, req, head);
  }

  public onLeave(ws: WebSocket, req: IncomingMessage, head: any) {
    ws.on(WebSocketServer.CLOSE, () => {
      this.emit(WebSocketServer.ENTER, ws, req, head);
    });
  }

  public attach(server: Server) {
    const wss = new WebSocket.Server({ server });
    this.server = wss;
    wss.on(WebSocketServer.CONNECTION, async (ws: WebSocket, req: IncomingMessage, head: any) => {
      const scope: Scope = Object.create(this.scope);
      scope.time.reset();
      this.onEnter(ws, req, head);
      this.onMessage(ws, scope);
      this.onLeave(ws, req, head);
    });

    server.on('upgrade', (req, socket) => {
      this.routing(req, socket).then();
    });
  }

  protected async routing(req: IncomingMessage, ws: Socket) {
    const scope: Scope = Object.create(this.scope);
    scope.time.reset();
    const middlewares = this.middlewares;
    if (middlewares.length) {
      await processWebSocketMiddleware(middlewares, req, ws, scope);
    }
  }
}
