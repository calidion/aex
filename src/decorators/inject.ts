import { IncomingMessage, ServerResponse } from "http";
import { Scope } from "../scope";
import { IAsyncMiddleware } from "../types";

export function inject(cb: IAsyncMiddleware) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: any,
    descriptor: any
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      return (
        (await cb.apply(
          target,
          args as [IncomingMessage, ServerResponse, (Scope | undefined)?]
        )) !== false && origin.apply(target, args)
      );
    };
    return descriptor;
  };
}
