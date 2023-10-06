/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { IResponse } from "../types";

export function json(res: IResponse) {
  Object.defineProperty(res, "json", {
    enumerable: false,
    value(o: object) {
      res.end(JSON.stringify(o));
    },
  });
}
