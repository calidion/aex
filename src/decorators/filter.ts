/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import * as validator from "node-form-validator";
import { One } from "../one";
import { Scope } from "../scope";
import InternalServerError from "../status/500";
import { IAsyncFilterMiddleware } from "../types";

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
}

export function filter(options: IFilterOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const func = descriptor.value;

    let extracted: any;
    let error: any;

    function validate(data: any, rules: any, scope: Scope) {
      error = validator.validate(data, rules);
      if (!error) {
        return false;
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
      const req = args[0];
      const scope = args[2];
      scope.extracted = {};
      let passed;
      const instance = One.getInstance(target, propertyKey);
      for (const key of Object.keys(options)) {
        switch (key) {
          case "params":
            passed = validate(req.params, options.params, scope);
            break;
          case "body":
            passed = validate(req.body, options.body, scope);
            break;
          case "query":
            passed = validate(req.query, options.query, scope);

            break;
        }
        if (!passed) {
          const fallbacks = options.fallbacks as any;
          const handler: any = fallbacks ? fallbacks[key] : null;
          if (handler) {
            const newArgs = [error].concat(args);
            return handler.apply(instance, newArgs);
          }

          InternalServerError(args[1]);
          return;
        }

        scope.extracted[key] = extracted;
      }
      return func.apply(this, args);
    };
    return descriptor;
  };
}
