import * as assert from "assert";
import { METHODS } from "http";
import { One } from "./one";

export function http(name: string | string[], url: string | string[]) {
  const router = One.instance();
  // tslint:disable-next-line: only-arrow-functions
  return function(
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const func = descriptor.value;

    function invoke(...args: any[]) {
      func.apply(target, args);
    }

    function addUrl(method: string) {
      if (typeof url === "string") {
        router[method.toLowerCase()](url, invoke);
        return;
      }
      assert(Array.isArray(url));
      for (const u of url) {
        router[method.toLowerCase()](u, invoke);
      }
    }

    if (typeof name === "string") {
      if (name === "*") {
        for (const method of METHODS) {
          addUrl(method);
        }
        return descriptor;
      }

      if (METHODS.indexOf(name.toUpperCase()) !== -1) {
        name = name.toLowerCase();
        addUrl(name);
      }
      return descriptor;
    }

    assert(Array.isArray(name));

    for (const item of name) {
      if (METHODS.indexOf(item.toUpperCase()) !== -1) {
        addUrl(item);
      }
    }
    return descriptor;
  };
}
