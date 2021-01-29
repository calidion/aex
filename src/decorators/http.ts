/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { One } from "./one";
/**
 *
 * @param name http method or array
 * @param url route name or array
 */

export function http(name: string | string[], url?: string | string[]) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const cache = One.cache;
    cache.push([target, _propertyKey, name, url]);
    return descriptor;
  };
}
