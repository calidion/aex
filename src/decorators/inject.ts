/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { One } from "../one";
import { IHandler } from "../types";
import { getMiddleArgs } from "../util";

/**
 *
 * @param injector main logic / data processing middleware or some checks
 * @param fallback optional fallback when the injector fails
 */
export function inject(
  injector: IHandler,
  fallback?: IHandler,
  isCompact?: boolean
) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      const newArgs = getMiddleArgs(args);
      const [req, res, scope] = newArgs;
      const instance = One.getInstance(target.constructor.name, propertyKey);

      let params = [req, res, scope] as any;
      if (isCompact) {
        params = [{ req, res, scope }] as any;
      }
      const result = await injector.apply(instance, params);
      if (result === false) {
        if (fallback) {
          await fallback.apply(instance, params);
        }
        return false;
      }
      return origin.apply(instance, args);
    };
    return descriptor;
  };
}
