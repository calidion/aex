import * as bodyParser from "body-parser";
import { IncomingMessage, ServerResponse } from "http";
import { toAsyncMiddleware } from "../util";
import { Scope } from "../scope";

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
    return function() {};
  }
  const parser: any = bodyParser;
  const cb = parser[type](options);
  const asyncCB = toAsyncMiddleware(cb);
  return function(target: any, _propertyKey: any, descriptor: any) {
    const origin = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      await asyncCB.apply(
        asyncCB,
        args as [IncomingMessage, ServerResponse, (Scope | undefined)?]
      );
      origin.apply(target, args);
    };
    return descriptor;
  };
}
