/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */


 export interface IInitFunction  {
   render: (name: string, data: any) => void
 }


 /**
  * 
  * @param init template initializing function that returns an template engine
  * @param path path where the templates are located
  * @param ext file extension if necessary, defaults to html
  * @param options options if necessary
  */

export function template(
  init: (path: string, ext: string, options: any) => IInitFunction,
  path: string,
  ext: string = "html",
  options: any = {}
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
      const res = args[1];
      const scope = args[2];
      const engine = init(path, ext, options);
      res.render = function (name: string, data: any) {
        res.end(engine.render(name, data));
      };
      scope.engine = engine;
      await origin.apply(this, args);
    };
    return descriptor;
  };
}
