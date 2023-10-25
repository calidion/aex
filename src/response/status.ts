/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { existsSync, lstatSync, readFileSync } from "fs";
import { ServerResponse, STATUS_CODES } from "http";

export function status(res: ServerResponse) {
  Object.defineProperty(res, "status", {
    enumerable: false,
    value(code: number, file: string) {
      res.statusCode = code;
      res.statusMessage = STATUS_CODES[code] || "";
      let html = res.statusMessage;
      if (file && existsSync(file) && lstatSync(file).isFile()) {
        html = String(readFileSync(file));
      }
      res.write(html);
      res.end();
    },
  });
}
