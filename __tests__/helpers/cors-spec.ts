// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex, http, inject, cors } from "../../src/index";

import { GetText, initRandomPort } from "../../src/index";

class Cors {
  @http("get", "/")
  @inject(cors())
  public async index(_req: any, res: any, _scope: any) {
    // console.log(res.headers);
    // console.log(req.headers);
    res.end("Hello Local!");
  }

  @http("get", "/sina")
  @inject(cors("http://sina.com"))
  public async sina(_req: any, res: any, _scope: any) {
    // console.log(req.headers);
    // console.log(res.headers);
    // console.log(res);
    res.end("Hello Sina!");
  }
}

const aex = new Aex();

aex.push(Cors);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should decorate methods with single http method name", async () => {
  const res = await GetText(port, "Hello Local!", "/", "localhost");
  expect(res.headers["access-control-allow-origin"]).toBe("*");
});

test("Should decorate methods with single http method name", async () => {
  const res = await GetText(port, "Hello Local!", "/", "localhost", {
    headers: {
      Origin: "http://localhost:3800",
    },
  });
  expect(res.headers["access-control-allow-origin"]).toBe(
    "http://localhost:3800"
  );
});

test("Should decorate methods with single http method name", async () => {
  const res = await GetText(port, "Hello Local!", "/", "localhost", {
    headers: {
      Origin: "http://localhost:3800",
      Refer: "http://sina.com:3800",
    },
  });
  expect(res.headers["access-control-allow-origin"]).toBe(
    "http://sina.com:3800"
  );
});

test("Should decorate methods with single http method name", async () => {
  const res = await GetText(port, "Hello Local!", "/", "localhost", {
    headers: {
      Origin: "http://localhost:3800",
      Refer: ["http://weibo.com:3800", "http://sina.com:3800"],
    },
  });
  expect(res.headers["access-control-allow-origin"]).toBe(
    "http://weibo.com:3800, http://sina.com:3800"
  );
});

test("Should decorate methods with single http method name", async () => {
  const res = await GetText(port, "Hello Sina!", "/sina", "localhost", {
    headers: {
      Origin: "http://localhost:3800",
    },
  });
  expect(res.headers["access-control-allow-origin"]).toBe("http://sina.com");
});

afterAll(async () => {
  aex.server?.close();
});
