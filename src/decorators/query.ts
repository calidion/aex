import * as qs from "querystring";

export function query() {
  // tslint:disable-next-line: only-arrow-functions
  return function(target: any, _propertyKey: any, descriptor: any) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function(...args: any[]) {
      const req = args[0];

      let splited:any = req.url as string;
      splited = splited.split("?");
      if (splited.length > 1) {
        req.query = qs.parse(splited[1]);
      }
      await origin.apply(target, args);
    };
    return descriptor;
  };
}
