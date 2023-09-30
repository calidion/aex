// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { createReadStream, readFileSync } from "fs";
import { resolve } from "path";
import { Aex, IACompactedAsyncMiddeleWare, formdata } from "../../src/index";
import { http } from "../../src/index";
import * as request from "request";

import { initRandomPort } from "../../src/util/request";
import { copyByKey } from "../../src/util/kv";

class Formdata {
  protected name = "formdata";

  @http("post", "/file/upload")
  @formdata()
  public async upload(_req: any, res: any, scope: any) {
    const { files, body } = scope;
    expect(body["node"] === "v4").toBeTruthy();
    expect(body["nods"] === "v5").toBeTruthy();
    expect(files["file"].length === 3).toBeTruthy();
    expect(files["oddd"].length === 1).toBeTruthy();
    expect(this.name === "formdata");
    const aaa = files["file"][0];
    expect(String(readFileSync(aaa.temp)) === "AAA").toBeTruthy();
    const bbb = files["file"][1];
    expect(String(readFileSync(bbb.temp)) === "BBB").toBeTruthy();
    const ccc = files["file"][2];
    expect(String(readFileSync(ccc.temp)) === "CCC").toBeTruthy();
    res.end("File Uploaded!");

    copyByKey({ 1: {} }, {});
  }

  @http("post", "/file/upload1", true)
  @formdata()
  public async upload1(context: IACompactedAsyncMiddeleWare) {
    const { res, scope } = context;
    const { files, body } = scope as any;
    expect(body["node"] === "v4").toBeTruthy();
    expect(body["nods"] === "v5").toBeTruthy();
    expect(files["file"].length === 3).toBeTruthy();
    expect(files["oddd"].length === 1).toBeTruthy();
    expect(this.name === "formdata");
    const aaa = files["file"][0];
    expect(String(readFileSync(aaa.temp)) === "AAA").toBeTruthy();
    const bbb = files["file"][1];
    expect(String(readFileSync(bbb.temp)) === "BBB").toBeTruthy();
    const ccc = files["file"][2];
    expect(String(readFileSync(ccc.temp)) === "CCC").toBeTruthy();
    res.end("File Uploaded!");

    copyByKey({ 1: {} }, {});
  }
}

const aex = new Aex();
aex.push(Formdata);
aex.prepare();

let port: number = 0;

describe("formdata", () => {
  beforeAll(async () => {
    port = await initRandomPort(aex);
  });

  test("Should upload files", async () => {
    const url = "http://localhost:" + port + "/file/upload";

    var formData = {
      file: [
        createReadStream(resolve(__dirname, "./fixtures/aaa.txt")),
        createReadStream(resolve(__dirname, "./fixtures/bbb.txt")),
        createReadStream(resolve(__dirname, "./fixtures/ccc.txt")),
      ],
      oddd: createReadStream(resolve(__dirname, "./fixtures/ccc.txt")),
      node: "v4",
      nods: "v5",
    };

    var uploadOptions = {
      url,
      method: "POST",
      formData: formData,
    };

    // let httpReq: any;

    const body = await new Promise((resolve, reject) => {
      request.post(uploadOptions, function (err: any, _resp: any, body: any) {
        if (err) {
          return reject(err);
        } else {
          resolve(body);
        }
      });
    });
    expect(body === "File Uploaded!").toBeTruthy();
  });

  test("Should upload1 files", async () => {
    const url = "http://localhost:" + port + "/file/upload1";

    var formData = {
      file: [
        createReadStream(resolve(__dirname, "./fixtures/aaa.txt")),
        createReadStream(resolve(__dirname, "./fixtures/bbb.txt")),
        createReadStream(resolve(__dirname, "./fixtures/ccc.txt")),
      ],
      oddd: createReadStream(resolve(__dirname, "./fixtures/ccc.txt")),
      node: "v4",
      nods: "v5",
    };

    var uploadOptions = {
      url,
      method: "POST",
      formData: formData,
    };

    // let httpReq: any;

    const body = await new Promise((resolve, reject) => {
      request.post(uploadOptions, function (err: any, _resp: any, body: any) {
        if (err) {
          return reject(err);
        } else {
          resolve(body);
        }
      });
    });
    expect(body === "File Uploaded!").toBeTruthy();
  });

  afterAll(async () => {
    aex.server?.close();
  });
});
