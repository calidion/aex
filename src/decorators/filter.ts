/**
 * Copyright(c) 2020-
 * Author: calidion<calidion@gmail.com>
 * MIT Licensed
 */

import * as validator from "node-form-validator";
import { One } from "../one";
import { Scope } from "../scope";
import BadRequest from "../status/400";
import { IAsyncFilterMiddleware } from "../types";
import { getMiddleArgs } from "../util";

export interface IFilterFallback {
  params?: IAsyncFilterMiddleware;
  body?: IAsyncFilterMiddleware;
  query?: IAsyncFilterMiddleware;
  [x: string]: any;
}

export interface IFilterOptions {
  params?: any;
  body?: any;
  query?: any;
  fallbacks?: IFilterFallback;
  [x: string]: any;
}

export function filter(options: IFilterOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const func = descriptor.value;

    let extracted: any;
    let error: any;

    function validate(data: any, rules: any, scope: Scope) {
      error = validator.validate(data, rules);
      if (error === false) {
        for (const key of Object.keys(rules)) {
          if (rules[key].required) {
            return false;
          }
        }
        return true;
      }
      if (error.code !== 0) {
        const debug = scope.debug("aex:filter");
        debug(error.message);
        return false;
      }

      extracted = error.data;
      return true;
    }

    descriptor.value = async function temp(...args: any[]) {
      const newArgs = getMiddleArgs(args);
      const [req, , scope] = newArgs;
      scope.extracted = {};
      let passed;
      const instance = One.getInstance(target.constructor.name, propertyKey);
      for (const key of ["params", "query", "body"]) {
        if (!options[key] || Object.keys(options[key]).length === 0) {
          continue;
        }
        passed = validate(req[key], options[key], scope);
        if (!passed) {
          const fallbacks = options.fallbacks as any;
          const handler: any = fallbacks ? fallbacks[key] : null;
          if (handler) {
            return handler.apply(instance, [error].concat(newArgs));
          }
          const { debug } = scope;
          const printer = debug("aex:filter");
          printer("Bad Request!");
          BadRequest(newArgs[1]);
          return;
        }

        scope.extracted[key] = extracted;
      }
      return func.apply(this, args);
    };
    return descriptor;
  };
}
