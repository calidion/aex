import * as validator from "node-form-validator";

export interface IFilterOptions {
  params?: any;
  body?: any;
  query?: any;
}

export function filter(options: IFilterOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function(
    target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const func = descriptor.value;

    let extracted: any;

    function validate(data: any, rules: any) {
      console.log(data, rules);
      const error = validator.validate(data, rules);
      if (!error) {
        return false;
      }

      if (error.code !== 0) {
        // tslint:disable-next-line: no-console
        console.error(error.message);
        return false;
      }

      extracted = error.data;
      return true;
    }

    descriptor.value = async function temp(...args: any[]) {
      const req = args[0];
      const scope = args[2];
      scope.extracted = {};
      let passed;
      console.log("filter");
      for (const key of Object.keys(options)) {
        switch (key) {
          case "params":
            passed = validate(req.params, options.params);
            break;
          case "body":
            passed = validate(req.body, options.body);
            break;
          case "query":
            passed = validate(req.query, options.query);
            break;
        }
        if (!passed) {
          return false;
        }

        scope.extracted[key] = extracted;
      }
      return func.apply(target, args);
    };
    return descriptor;
  };
}
