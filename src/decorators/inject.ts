/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { IncomingMessage, ServerResponse } from "http";
import { One } from "../one";
import { Scope } from "../scope";
import { IAsyncMiddleware } from "../types";

export function inject(cb: IAsyncMiddleware) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    propertyKey: any,
    descriptor: any
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      const instance = One.getInstance(target, propertyKey);
      return (
        (await cb.apply(
          instance,
          args as [IncomingMessage, ServerResponse, (Scope | undefined)?]
        )) !== false && origin.apply(instance, args)
      );
    };
    return descriptor;
  };
}
