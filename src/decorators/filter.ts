import * as validator from "node-form-validator";
import InternalServerError from "../status/500";
import { IAsyncMiddleware } from "../types";

export interface IFilterFailback {
  params?: IAsyncMiddleware;
  body?: IAsyncMiddleware;
  query?: IAsyncMiddleware;
}

export interface IFilterOptions {
  params?: any;
  body?: any;
  query?: any;
  failbacks?: IFilterFailback;
}

export function filter(options: IFilterOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function(
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const func = descriptor.value;

    let extracted: any;

    function validate(data: any, rules: any) {
      const error = validator.validate(data, rules);
      if (!error) {
        return false;
      }

      if (error.code !== 0) {
        // tslint:disable-next-line: no-console
        console.error(error.message);
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
      for (const key of Object.keys(options)) {
        switch (key) {
          case "params":
            passed = validate(req.params, options.params);
            break;
          case "body":
            passed = validate(req.body, options.body);
            break;
          case "query":
            passed = validate(req.query, options.query);

            break;
        }
        if (!passed) {
          const failbacks = options.failbacks as any;
          const handler: any = failbacks ? failbacks[key] : null;
          if (handler) {
            return handler.apply(target, args);
          }

          InternalServerError(args[1]);
          return;
        }

        scope.extracted[key] = extracted;
      }
      return func.apply(target, args);
    };
    return descriptor;
  };
}
