/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { One } from "../one";

export function listen(eventName: string) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    // tslint:disable-next-line: variable-name
    target: any,
    // tslint:disable-next-line: variable-name
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const listeners = One.listeners;
    listeners.push([target, propertyKey, eventName]);
    return descriptor;
  };
}
