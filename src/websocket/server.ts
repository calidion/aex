/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { EventEmitter } from "events";
import * as WebSocket from "ws";
import { Scope } from "../scope";
import { IRequest, IServer, IWebSocketAsyncMiddleware } from "../types";
import { processWebSocketMiddleware } from "../util";
import { MessageHandler } from "./handler";

export class WebSocketServer extends EventEmitter {
  public static ENTER = "enter";
  public static UPGRADE = "upgrade";
  public static CONNECTION = "connection";

  private server: WebSocket.Server;

  private middlewares: IWebSocketAsyncMiddleware[] = [];

  constructor(server: IServer) {
    super();
    this.server = new WebSocket.Server({ server });
    this.server.on(
      WebSocketServer.CONNECTION,
      async (ws: WebSocket, req: IRequest) => {
        const scope: Scope = new Scope();
        scope.time.reset();
        scope.outer.ws = ws;
        scope.outer.req = req;
        const middlewares = this.middlewares;
        if (middlewares.length) {
          if (await processWebSocketMiddleware(middlewares, req, ws, scope)) {
            return;
          }
        }
        this.onEnter(scope);
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
}
