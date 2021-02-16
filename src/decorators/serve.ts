import * as finalhandler from "finalhandler";
import { IncomingMessage, ServerResponse } from "http";
import * as staticServer from "serve-static";

import { One } from "../one";
import { Scope } from "../scope";

/**
 * serve static files
 * @param url static files base url
 * @param options options are of the same options used by the server-static package
 */

export function serve(url: string, options?: staticServer.ServeStaticOptions) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    const cache = One.cache;
    cache.push([target, propertyKey, ["get", "head"], url + "/:file"]);

    // // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (
      req: IncomingMessage,
      res: ServerResponse,
      scope: Scope
    ) {
      const realPath = await origin.apply(this, [req, res, scope]);

      const { params } = scope;
      const { file } = params;
      req.url = (file as unknown) as string;
      staticServer(realPath, options)(
        req,
        res,
        finalhandler(req, res) as () => {}
      );
    };
    return descriptor;
  };
}
