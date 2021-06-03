// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { resolve } from "path";

import { GetStatus, initRandomPort } from "../../src/util/request";
import { Aex, GetText, serve, assets } from "../../src";

class StaticFileServer {
  protected name = "formdata";

  @serve("/assets")
  public async upload() {
    return resolve(__dirname, "./fixtures");
  }

  @assets("/alias")
  public async ass() {
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

  test("Should access files", async () => {
    await GetText(port, "SUBAAA", "/assets/subdir/aaa.txt");
  });

  test("Should access files", async () => {
    await GetText(port, "SUBSUBAAA", "/assets/subdir/subsubdir/aaa.txt");
  });

  test("Should access files", async () => {
    await GetText(port, "", "/assets/subdir/subsubdir/bbb");
  });

  test("Should access files", async () => {
    await GetText(port, "", "/alias/subdir/subsubdir/bbb");
  });

  test("Should 400 files", async () => {
    await GetStatus(port, "/assets/subdir/../bbb.txt", 400);
  });

  test("Should 404 files", async () => {
    await GetStatus(port, "/assets/subdir/subdir/bbb.txt", 404);
  });

  afterAll(async () => {
    aex.server?.close();
  });
});
