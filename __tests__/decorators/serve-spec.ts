// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { resolve } from "path";

import { initRandomPort } from "../../src/util/request";
import { Aex, GetText, serve } from "../../src";

class StaticFileServer {
  protected name = "formdata";

  @serve("/assets")
  public async upload() {
    return resolve(__dirname, "./fixtures");
  }
}

const aex = new Aex();
aex.push(StaticFileServer);
aex.prepare();

let port: number = 0;

describe("serve", () => {
  beforeAll(async () => {
    port = await initRandomPort(aex);
  });

  test("Should access files", async () => {
    await GetText(port, "AAA", "/assets/aaa.txt");
  });

  test("Should access files", async () => {
    await GetText(port, "BBB", "/assets/bbb.txt");
  });

  test("Should access files", async () => {
    await GetText(port, "CCC", "/assets/ccc.txt");
  });

  afterAll(async () => {
    aex.server?.close();
  });
});
