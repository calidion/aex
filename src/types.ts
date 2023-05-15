/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { IncomingMessage, Server, ServerResponse } from "http";
import * as WebSocket from "ws";
import { Scope } from "./scope";

export type ICallback = (error: Error) => void;
export type Request = IncomingMessage;
export type Response = ServerResponse;

export type IRequest = Request | null;
export type IResponse = Response | null;
export type IServer = Server | any;

export type IMiddeleWare = (
  req: Request | any,
  res: Response | any,
  next: ICallback | any
) => void;

export type IAsyncMiddleware = (
  req: Request,
  res: Response,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export type IAsyncFilterMiddleware = (
  error: any,
  req: Request,
  res: Response,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export type IAsyncHandler = IAsyncMiddleware;

export interface IRouteItem {
  handler: IAsyncHandler;
  middlewares?: IAsyncMiddleware[];
}

export interface IRoute {
  [key: string]: { [key: string]: IRouteItem };
}

export interface IOptions {
  method: string;
  url: string | string[];
  handler: IAsyncHandler;
  middlewares?: IAsyncMiddleware[];
}

// Websocket
export type IWebSocketAsyncMiddleware = (
  req: Request,
  socket: WebSocket,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export interface IWebSocketOptions {
  url: string | string[];
  middlewares?: IWebSocketAsyncMiddleware[];
}
