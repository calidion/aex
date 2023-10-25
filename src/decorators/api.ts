/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import * as bodyParser from "body-parser";
import { parseStringToNumber } from "../helpers/paginator";
import { One } from "../one";
import { getMiddleArgs, toAsyncMiddleware } from "../util";
import { parseQuery } from "../util/parseQuery";

/**
 *
 * @param name http method or array
 * @param url route name or array
 */

export interface IAPIOptions {
  isCompact?: boolean; // default to true
  body?: {
    type?: string; // default to "urlencoded",
    options?: any; // default to { extended: false }
  };
}

export function api(url?: string | string[], restOptions?: IAPIOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const cache = One.cache;
    const restMethods = ["get", "post"];
    cache.push([
      target,
      _propertyKey,
      restMethods,
      url,
      !restOptions?.isCompact,
    ]);
    // // tslint:disable-next-line: only-arrow-functions
    const origin = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const newArgs = getMiddleArgs(args);
      const [req, res, scope] = newArgs;

      // Parse Query
      // let splited: any = req.url as string;
      // splited = splited.split("?");
      // if (splited.length > 1) {
      //   req.query = qs.parse(splited[1]);
      // }
      // Object.assign(scope.query, req.query);
      parseQuery(req, scope);

      // Parse Body for POST
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

      // check api necessities
      // 1. Init pagination or other basic api info
      const limit = parseStringToNumber(scope.query.limit);
      const page = parseStringToNumber(scope.query.page);
      const offset = (page - 1) * limit;

      const pagination = {
        limit,
        offset,
        page,
      };

      scope.pagination = pagination;

      if (req.method.toLowerCase() === "get") {
        await origin.apply(this, args);
      } else {
        const action = scope.body.action;

        const func = (this as any)[action];
        if (typeof func === "function") {
          await func.apply(this, args);
        } else {
          res.status(501);
        }
      }
    };

    return descriptor;
  };
}
