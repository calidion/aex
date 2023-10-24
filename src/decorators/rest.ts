/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import * as bodyParser from "body-parser";
import { One } from "../one";
import { getMiddleArgs, toAsyncMiddleware } from "../util";
/**
 *
 * @param name http method or array
 * @param url route name or array
 */

export interface IRestOptions {
  isCompact?: boolean; // default to true
  body?: {
    type?: string; // default to "urlencoded",
    options?: any; // default to { extended: false }
  };
}

export function rest(url?: string | string[], restOptions?: IRestOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const cache = One.cache;
    const restMethods = ["get", "put", "post", "patch", "delete"];
    cache.push([
      target,
      _propertyKey,
      restMethods,
      url,
      !restOptions?.isCompact,
    ]);
    // // tslint:disable-next-line: only-arrow-functions
    // const origin = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const newArgs = getMiddleArgs(args);
      const [req, , scope] = newArgs;
      if (req.method.toLowerCase() !== "get") {
        const body = restOptions?.body || {};
        let type = body.type || "urlencoded";
        const options = body.options || { extended: false };

        const bodyTypes = ["urlencoded", "raw", "text", "json"];

        if (bodyTypes.indexOf(type) === -1) {
          type = "urlencoded";
        }
        const parser: any = bodyParser;
        const cb = parser[type](options);
        const asyncCB = toAsyncMiddleware(cb);
        await asyncCB.apply(asyncCB, newArgs as any);
        Object.assign(scope.body, req.body);
      }
      const func = (this as any)[req.method.toLowerCase()];
      if (typeof func === "function") {
        await func.apply(this, args);
      } else {
        throw Error("restful method " + req.method + " handler missing!");
      }
    };

    return descriptor;
  };
}
