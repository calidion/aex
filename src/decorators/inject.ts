/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { IncomingMessage, ServerResponse } from "http";
import { One } from "../one";
import { Scope } from "../scope";
import { IAsyncMiddleware } from "../types";

/**
 *
 * @param injector main logic / data processing middleware or some checks
 * @param fallback optional fallback when the injector fails
 */
export function inject(
  injector: IAsyncMiddleware,
  fallback?: IAsyncMiddleware
) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (
      req: IncomingMessage,
      res: ServerResponse,
      scope?: Scope
    ) {
      const instance = One.getInstance(target, propertyKey);
      const result = await injector.apply(instance, [req, res, scope]);
      if (result === false) {
        if (fallback) {
          await fallback.apply(instance, [req, res, scope]);
        }
        return false;
      }
      return origin.apply(instance, [req, res, scope]);
    };
    return descriptor;
  };
}
