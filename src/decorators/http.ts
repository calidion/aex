/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { One } from "../one";
/**
 *
 * @param name http method or array
 * @param url route name or array
 */

export function http(
  name: string | string[],
  url?: string | string[],
  isCompact?: boolean
) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const cache = One.cache;
    cache.push([target, _propertyKey, name, url, isCompact]);
    return descriptor;
  };
}

export function get(url?: string | string[], isCompact?: boolean) {
  return http("get", url, isCompact);
}

export function post(url?: string | string[], isCompact?: boolean) {
  return http("post", url, isCompact);
}

export function compact(name: string | string[], url?: string | string[]) {
  return http(name, url, true);
}
