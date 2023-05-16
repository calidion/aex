/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { promisify } from "util";
import * as WebSocket from "ws";
import { Scope } from "./scope";
import {
  IAsyncMiddleware,
  IMiddeleWare,
  IRequest,
  IResponse,
  IWebSocketAsyncMiddleware,
} from "./types";

export function toAsyncMiddleware(cb: IMiddeleWare): IAsyncMiddleware {
  return async (req: IRequest, res: IResponse) => {
    const promisified = promisify(cb);
    await promisified(req, res);
  };
}

export async function processMiddleware(
  req: IRequest,
  res: IResponse,
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
  req: IRequest,
  socket: WebSocket,
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
