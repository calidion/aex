/**
 * aex
 * Copyright(c) 2020-
 * calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { Scope } from "../scope";
import { IRequest } from "../types";

import * as Busboy from "busboy";
import { mkdtempSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { extname, join, resolve as pathResolve } from "path";

import { v4 } from "uuid";
import { getMiddleArgs } from "../util";
import { copyByKey } from "../util/kv";

export async function parseFormData(
  options: busboy.BusboyConfig,
  req: IRequest,
  scope: Scope
) {
  options.headers = req.headers;
  const busboy = new Busboy(options);

  const body: any = {};
  const files: any = {};

  return new Promise((resolve, reject) => {
    busboy.on(
      "file",
      function uploading(
        fieldname: string,
        stream: any,
        filename: string,
        encoding: string,
        mimetype: string
      ) {
        if (!files[fieldname]) {
          files[fieldname] = [];
        }

        const temp = {
          encoding,
          filename,
          mimetype,
          temp: "",
        };

        stream.on("data", function onData(data: any) {
          const folder = mkdtempSync(join(tmpdir(), "aex-"));
          const tmpfilename =
            pathResolve(folder, "./" + v4()) + extname(filename);
          writeFileSync(tmpfilename, data);
          temp.temp = tmpfilename;
          files[fieldname].push(temp);
        });
        stream.on("error", reject);
      }
    );
    busboy.on("field", function onField(fieldname: string, val: any) {
      body[fieldname] = val;
    });
    busboy.on("finish", function onFinish() {
      copyByKey(body, scope.body);
      copyByKey(files, scope.files);
      resolve(true);
    });
    req.pipe(busboy);
  });
}

/**
 *
 * @param type body parser function name within ["urlencoded", "raw", "text", "json"]
 * @param options options are of the same options used by body-parser functions
 */
export function formdata(options: busboy.BusboyConfig = {}) {
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
      const newArgs = getMiddleArgs(args);
      const [req, , scope] = newArgs;
      await parseFormData(options, req, scope);
      await origin.apply(this, args);
    };
    return descriptor;
  };
}
