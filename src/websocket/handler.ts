import { EventEmitter } from 'events';
import * as WebSocket from 'ws';
import { Scope } from '../scope';

export class MessageHandler extends EventEmitter {
  public static MESSAGE = "message";
  public static ERROR = "error";

  // private scope: Scope;
  constructor(scope: Scope) {
    super();
    // this.scope = scope;
    this.onMessage(scope);
  }

  // public send(event: string, data: object) {
  //   const ws: WebSocket = this.scope.outer.ws as WebSocket;
  //   ws.send({
  //     data,
  //     event,
  //   });
  // }

  public onMessage(scope: Scope) {
    const ws: WebSocket = scope.outer.ws as WebSocket;
    ws.on(MessageHandler.MESSAGE, (data: Buffer) => {
      try {
        const message = JSON.parse(String(data));
        this.emit(message.event, message.data);
      } catch (e) {
        this.emit(MessageHandler.ERROR, {
          message: "JSON format error!",
          raw: String(data)
        });
      }
    });
  }
}