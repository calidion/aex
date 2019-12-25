import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { promisify } from "util";
import { Scope } from "./scope";
import { IAsyncMiddleware, IMiddeleWare, IWebSocketAsyncMiddleware } from './types';

export function toAsyncMiddleware(cb: IMiddeleWare): IAsyncMiddleware {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const promisified = promisify(cb);
    await promisified(req, res);
  };
}

export async function processMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  middlewares: IAsyncMiddleware[],
  scope?: Scope
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

export async function processWebSocketMiddleware(
  middlewares: IWebSocketAsyncMiddleware[],
  req: IncomingMessage,
  socket: Socket,
  scope?: Scope
): Promise<boolean> {
  for (const middleware of middlewares) {
    const leave = await middleware(req, socket, scope);
    // Stop middleware execution when false is returned.
    if (leave === false) {
      return true;
    }
  }
  return false;
}
