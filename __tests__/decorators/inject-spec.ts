// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex, One } from "../../src/index";
import { body } from "../../src/index";
import { http } from "../../src/index";
import { inject } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";

class Inject {
  protected name = "inject";
  public fallbacked = false;

  @http("post", "/user/login")
  @body()
  // tslint:disable-next-line: variable-name
  @inject(async function (this: any, _req, _res, scope) {
    expect(this.name === "inject");
    if (scope) {
      scope.outer.session = {
        user: {
          name: "ok",
        },
      };
    }
  })
  public async login(req: any, res: any, scope: any) {
    expect(this.name === "inject");
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    expect(scope!.outer!.session!.user!.name === "ok");
    res.end("Inject All!");
  }

  @http("post", "/user/fallback")
  @body()
  // tslint:disable-next-line: variable-name
  @inject(
    async function (this: Inject) {
      expect(this.name === "inject");
      return false;
    },
    async function (this: Inject, _req, res) {
      expect(this.name === "inject");
      this.fallbacked = true;
      res.end("Fallback!");
      return false;
    }
  )
  public async fallback(req: any, res: any, scope: any) {
    expect(this.name === "inject");
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    expect(scope!.outer!.session!.user!.name === "ok");
    res.end("Inject All!");
  }
  @http("post", "/user/nofallback")
  @body()
  // tslint:disable-next-line: variable-name
  @inject(async function (this: Inject, _req, res) {
    expect(this.name === "inject");
    res.end("No Fallback!");
    return false;
  })
  public async nocallback(req: any, res: any, scope: any) {
    expect(this.name === "inject");
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    expect(scope!.outer!.session!.user!.name === "ok");
    res.end("Inject All!");
  }
}

const aex = new Aex();

let port: number = 0;

beforeAll(async () => {
  One.reset();
  aex.push(Inject);
  aex.prepare();
  port = await initRandomPort(aex);
});

test("Should inject", async () => {
  await PostText(
    port,
    { username: "aaaa", password: "sosodddso" },
    "Inject All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

test("Should inject with fallback", async () => {
  await PostText(
    port,
    { username: "aaaa", password: "sosodddso" },
    "Fallback!",
    "/user/fallback",
    "localhost",
    "POST"
  );
  const instance = One.getInstance(Inject.prototype, "fallback");
  expect(instance.fallback).toBeTruthy();
});

test("Should fall with out fallback", async () => {
  await PostText(
    port,
    { username: "aaaa", password: "sosodddso" },
    "No Fallback!",
    "/user/nofallback",
    "localhost",
    "POST"
  );
  const instance = One.getInstance(Inject.prototype, "fallback");
  expect(instance.fallback).toBeTruthy();
});

afterAll(async () => {
  aex.server?.close();
});
