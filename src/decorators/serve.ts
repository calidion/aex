/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { createReadStream, existsSync, statSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { lookup } from "mime-types";
import { join } from "path";
import { One } from "../one";
import { Scope } from "../scope";
import NotFound from "../status/404";

/**
 * serve static files
 * @param url static files base url
 * @param options options are of the same options used by the server-static package
 */

export function serve(url: string) {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    const cache = One.cache;
    cache.push([target, propertyKey, ["get", "head"], url + "/(.*)"]);

    // // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (
      req: IncomingMessage,
      res: ServerResponse,
      scope: Scope
    ) {
      const realPath = await origin.apply(this, [req, res, scope]);

      const { params } = scope;
      const file = (params["0"] as unknown) as string;

      const filePath = join(realPath, file);

      if (!existsSync(filePath)) {
        return NotFound(res);
      }
      const stat = statSync(filePath);

      let ct = lookup(filePath);
      ct = ct ? ct : "text/plain";

      res.writeHead(200, {
        "content-length": String(stat.size),
        "content-type": ct,
      });

      const readStream = createReadStream(filePath);
      readStream.pipe(res);
    };
    return descriptor;
  };
}
export const assets = serve;
