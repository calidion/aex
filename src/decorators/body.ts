import * as bodyParser from "body-parser";
import { IncomingMessage, ServerResponse } from "http";
import { Scope } from "../scope";
import { toAsyncMiddleware } from "../util";

/**
 *
 * @param type body parser function name within ["urlencoded", "raw", "text", "json"]
 * @param options options are of the same options used by body-parser functions
 */
export function body(
  type: string = "urlencoded",
  options: any = { extended: false }
) {
  const bodyTypes = ["urlencoded", "raw", "text", "json"];

  if (bodyTypes.indexOf(type) === -1) {
    // tslint:disable-next-line: only-arrow-functions
    return function() {};
  }
  const parser: any = bodyParser;
  const cb = parser[type](options);
  const asyncCB = toAsyncMiddleware(cb);
  // tslint:disable-next-line: only-arrow-functions
  return function(target: any, _propertyKey: any, descriptor: any) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function(...args: any[]) {
      await asyncCB.apply(
        asyncCB,
        args as [IncomingMessage, ServerResponse, (Scope | undefined)?]
      );
      const req: any = args[0];
      const scope: Scope = args[2];
      Object.assign(scope.body, req.body);
      await origin.apply(target, args);
    };
    return descriptor;
  };
}
