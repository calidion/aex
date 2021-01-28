import * as assert from "assert";
import { METHODS } from "http";
import { One } from "./one";

/**
 *
 * @param name http method or array
 * @param url route name or array
 */

export function http(name: string | string[], url?: string | string[]) {
  const router = One.instance();
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const func = descriptor.value;

    async function invoke(...args: any[]) {
      return func.apply(target, args);
    }

    function addUrl(method: string, urls: string | string[]) {
      if (typeof urls === "string") {
        router[method.toLowerCase()](urls, invoke);
        return;
      }
      assert(Array.isArray(urls));
      for (const u of urls) {
        router[method.toLowerCase()](u, invoke);
      }
    }

    if (!url) {
      url = name;
      name = "get";
    }

    if (typeof name === "string") {
      if (name === "*") {
        for (const method of METHODS) {
          addUrl(method, url);
        }
        return descriptor;
      }

      if (METHODS.indexOf(name.toUpperCase()) !== -1) {
        name = name.toLowerCase();
        addUrl(name, url);
      }
      return descriptor;
    }

    assert(Array.isArray(name));

    for (const item of name) {
      if (METHODS.indexOf(item.toUpperCase()) !== -1) {
        addUrl(item, url);
      }
    }
    return descriptor;
  };
}
