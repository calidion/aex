/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { EventEmitter } from "events";
import * as WebSocket from "ws";
import { Scope } from "../scope";

export class MessageHandler extends EventEmitter {
  public static MESSAGE = "message";
  public static ERROR = "error";
  public static LEAVE = "leave";
  public static CLOSE = "close";

  // tslint:disable-next-line:variable-name
  private _scope: Scope;
  constructor(scope: Scope) {
    super();
    this._scope = scope;
    this.onMessage();
  }

  public send(event: string, data: object) {
    const ws: WebSocket = this._scope.outer.ws as WebSocket;
    ws.send(
      JSON.stringify({
        data,
        event,
      })
    );
  }

  private onMessage() {
    const ws: WebSocket = this._scope.outer.ws as WebSocket;
    ws.on(MessageHandler.MESSAGE, (data: Buffer) => {
      try {
        const message = JSON.parse(String(data));
        this.emit(message.event, message.data);
      } catch (e) {
        this.emit(MessageHandler.ERROR, {
          message: "JSON format error!",
          raw: String(data),
        });
      }
    });

    ws.on(MessageHandler.CLOSE, () => {
      this.emit(MessageHandler.LEAVE);
    });
  }
}
