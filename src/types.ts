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

export interface IACompactedMiddeleWare {
  req: IRequest;
  res: IResponse;
  next: ICallback | any;
}

export type ICompactedMiddeleWare = (context: IACompactedMiddeleWare) => void;

export type IClassicMiddeleWare = (
  req: IRequest,
  res: IResponse,
  next: ICallback | any
) => void;

// export type IMiddeleWare = ICompactedMiddeleWare | IClassicMiddeleWare;
export type IMiddeleWare = IClassicMiddeleWare;

export interface IACompactedAsyncMiddeleWare {
  req: IRequest;
  res: IResponse;
  scope?: Scope;
}
export type IContext = IACompactedAsyncMiddeleWare;

export type ICompactedAsyncMiddleware = (
  context: IACompactedAsyncMiddeleWare
) => Promise<boolean | undefined | null | void>;

export type IClassicAsyncMiddleware = (
  req: IRequest,
  res: IResponse,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export type IAsyncMiddleware =
  // | ICompactedAsyncMiddleware
  IClassicAsyncMiddleware;

export interface IACompactedAsyncFilterMiddeleWare {
  error: any;
  req: IRequest;
  res: IResponse;
  scope?: Scope;
}

export type ICompactedAsyncFilterMiddleware = (
  context: IACompactedAsyncFilterMiddeleWare
) => Promise<boolean | undefined | null | void>;

export type IClassicAsyncFilterMiddleware = (
  error: any,
  req: IRequest,
  res: IResponse,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;

export type IAsyncFilterMiddleware =
  // | ICompactedAsyncFilterMiddleware
  IClassicAsyncFilterMiddleware;

export type IAsyncHandler = IAsyncMiddleware;

export type IHandler = IClassicAsyncMiddleware | ICompactedAsyncMiddleware;

// 2. Router Types
export interface IRouteItem {
  compacted?: boolean;
  handler: IHandler;
  middlewares?: IAsyncMiddleware[];
}

export interface IRoute {
  [key: string]: { [key: string]: IRouteItem };
}

export interface IOptions {
  compacted?: boolean;
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
