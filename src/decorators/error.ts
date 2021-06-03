/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { Generator } from "errorable";
import { Scope } from "../scope";

/**
 *
 * @param errors Definitions of errors in json format
 * @param upperOrCamel name convention for generated errors
 */
export function error(
  errors: { [x: string]: object | string } = {},
  upperOrCamel: boolean = false
) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    // tslint:disable-next-line: variable-name
    _target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      const scope: Scope = args[2];
      const lang: string = errors.lang
        ? ((errors.lang as unknown) as string)
        : "en-US";

      delete errors.lang;

      const generated: any = Generator.generate(errors, upperOrCamel);

      const filtered: { [x: string]: (x: any) => any } = {};

      for (const key of Object.keys(generated)) {
        const func = generated[key];

        filtered[key] = ((l1) => {
          return function errorize(l2: string) {
            return new func(l2 ? l2 : l1);
          };
        })(lang);
      }

      Object.assign(scope.error, filtered);
      await origin.apply(this, args);
    };
    return descriptor;
  };
}
