import { IncomingMessage, ServerResponse } from "http";
import { Scope } from "./scope";

export type ICallback = (error: Error) => void;
export type Request = IncomingMessage;
export type Response = ServerResponse;

export type IMiddeleWare = (
  req: Request | any,
  res: Response | any,
  next: ICallback
) => void;
export type IAsyncMiddleware = (
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
