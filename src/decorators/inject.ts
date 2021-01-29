/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { IncomingMessage, ServerResponse } from "http";
import { Scope } from "../scope";
import { IAsyncMiddleware } from "../types";

export function inject(cb: IAsyncMiddleware) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    _target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: any,
    descriptor: any
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      return (
        (await cb.apply(
          this,
          args as [IncomingMessage, ServerResponse, (Scope | undefined)?]
        )) !== false && origin.apply(this, args)
      );
    };
    return descriptor;
  };
}
