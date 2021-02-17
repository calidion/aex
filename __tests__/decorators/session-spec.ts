// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { MemoryStore } from "@aex/session";
import { Aex, get, GetText, session } from "../../src/index";
import { http } from "../../src/index";

import { initRandomPort } from "../../src/index";

class Sessioned {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  @http("/session/login")
  @session()
  public sessioned(_req: any, res: any, scope: any) {
    const { session } = scope;
    session.user = "Alice";
    res.end("OK!");
  }

  @get("/session/get")
  @session()
  public road(_req: any, res: any, scope: any) {
    const { session } = scope;
    res.end(session.user);
  }
  @get("/session/new")
  @session(new MemoryStore())
  public store(_req: any, res: any, scope: any) {
    const { session } = scope;
    res.end(session.user);
  }
}

const aex = new Aex();

aex.push(Sessioned);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should work with session", async () => {
  const res = await GetText(port, "OK!", "/session/login", "localhost");

  expect(res.statusCode).toBe(200);
  let sessionId = res.headers!["set-cookie"]![0];

  expect(sessionId).toBeTruthy();
  const res1: any = await GetText(port, "Alice", "/session/get", "localhost", {
    headers: {
      Cookie: sessionId,
    },
  });
  expect(res1.statusCode).toBe(200);
  expect(res1.text).toBe("Alice");
});

afterAll(async () => {
  aex.server?.close();
});
