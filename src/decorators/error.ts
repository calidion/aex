import { Generator } from "errorable";
import { Scope } from "../scope";

/**
 *
 * @param errors Definitions of errors in json format
 * @param upperOrCamel name convention for generated errors
 */
export function error(
  errors: { [x: string]: object } = {},
  upperOrCamel: boolean = false
) {
  // tslint:disable-next-line: only-arrow-functions
  return function(target: any, _propertyKey: any, descriptor: any) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function(...args: any[]) {
      const scope: Scope = args[2];
      const generated = Generator.generate(errors, upperOrCamel);
      Object.assign(scope.error, generated);
      await origin.apply(target, args);
    };
    return descriptor;
  };
}
