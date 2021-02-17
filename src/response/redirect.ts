/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { ServerResponse } from "http";

export function redirect(res: ServerResponse) {
  Object.defineProperty(res, "redirect", {
    enumerable: false,
    value(url: string) {
      res.writeHead(301, { Location: url });
      res.end();
    },
  });
}
