/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { IResponse } from "../types";

export function redirect(res: IResponse) {
  Object.defineProperty(res, "redirect", {
    enumerable: false,
    value(url: string) {
      res.writeHead(301, { Location: url });
      res.end();
    },
  });
}
