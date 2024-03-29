/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { Cookie, MemoryStore, Store } from "@aex/session";
import { getMiddleArgs } from "../util";

export type ISessionStore = Store;

const memoryStore = new MemoryStore();

export function session(parser?: ISessionStore) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    // tslint:disable-next-line: variable-name
    _target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    if (!parser) {
      parser = memoryStore;
    }

    const cookie = new Cookie(parser);

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      const newArgs = getMiddleArgs(args);
      const [req, res, scope] = newArgs;

      await cookie.parse(req, res, scope);
      await origin.apply(this, args);
    };
    return descriptor;
  };
}
