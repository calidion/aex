// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { http } from "../../src/decorators/http";

import { IncomingMessage } from "http";
import { GetText, PostText, initRandomPort, GetTextWithAex } from "../../src/util/request";

class Hello {
  public static message = "Hello Aex!";
  @http("*", "*")
  public async all(_req: any, res: any, _scope: any) {
    res.end(Hello.message);
  }
}


const aex = new Aex();
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});


test("Should get all methods and urls", async () => {
  const exam = new Hello();
  expect(exam).toBeTruthy();
  await GetText(port, "Hello Aex!", "/");
  await PostText(port, {}, "Hello Aex!", "/abcd");
  const res = await PostText(
    port,
    {},
    "Hello Aex!",
    "/aaaa",
    "localhost",
    "OPTIONS"
  );
  expect(res instanceof IncomingMessage).toBeTruthy();
});

test("Should start with prepare", async () => {
  const aex = new Aex();
  const server = await aex.start(10000, "localhost", true);
  server.close();
  const res = await GetTextWithAex(aex, "Hello Aex!", "/");

  expect(res instanceof IncomingMessage).toBeTruthy();
});

test("Should start with prepare", async () => {
  const aex = new Aex();
  const server = await aex.prepare().start(8080);
  server.close();
});


afterAll(async () => {
  aex.server?.close();
});
