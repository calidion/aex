/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import {
  IncomingHttpHeaders,
  IncomingMessage,
  METHODS,
  RequestListener,
  Server,
  ServerResponse,
} from "http";
import * as WebSocket from "ws";
import { Scope } from "./scope";

// Constants
export const IHTTPMethods = METHODS;

export type ICallback = (error: Error) => void;

// Generalized HTTP Related Types
export type IRequest = IncomingMessage | any;
export type IResponse = ServerResponse | any;
export type IHTTPHeaders = IncomingHttpHeaders | any;
export type IServer = Server | any;
export type ICreateServer = (
  options?: any,
  requestListener?: RequestListener
) => IServer;
export interface IServerCreator {
  createServer(options?: any, requestListener?: RequestListener): IServer;
}

// Aex Framework Types

//    1. Middleware Types
export type IMiddeleWare = (
  req: IRequest,
  res: IResponse,
  next: ICallback | any
) => void;

export type IAsyncMiddleware = (
  req: IRequest,
  res: IResponse,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export type IAsyncFilterMiddleware = (
  error: any,
  req: IRequest,
  res: IResponse,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export type IAsyncHandler = IAsyncMiddleware;

// 2. Router Types
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

// 1. Websocket Types
export type IWebSocketAsyncMiddleware = (
  req: IRequest,
  socket: WebSocket,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export interface IWebSocketOptions {
  url: string | string[];
  middlewares?: IWebSocketAsyncMiddleware[];
}
