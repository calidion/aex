// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import {
  Aex,
  One,
  paginate,
  parseStringToNumber,
  query,
} from "../../src/index";
import { body } from "../../src/index";
import { http } from "../../src/index";
import { inject, hook } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";

class Inject {
  protected name = "inject";
  public fallbacked = false;

  @http("post", "/user/login")
  @query()
  @inject(paginate())
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
    expect(scope.query.page === 1);
    expect(scope.query.limit === 20);
    expect(scope.query.offset === 0);
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

  @http("post", "/user/fallback1")
  @body()
  // tslint:disable-next-line: variable-name
  @inject(
    async function (this: Inject, ctx: any) {
      expect(ctx.req).toBeTruthy();
      expect(ctx.res).toBeTruthy();
      expect(ctx.scope).toBeTruthy();
      expect(this.name === "inject");
      return false;
    },
    async function (this: Inject, ctx: any) {
      expect(this.name === "inject");
      this.fallbacked = true;
      ctx.res.end("Fallback!");
      return false;
    },
    true
  )
  public async fallback1(req: any, res: any, scope: any) {
    expect(this.name === "inject");
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    expect(scope!.outer!.session!.user!.name === "ok");
    res.end("Inject All!");
  }

  @http("post", "/user/fallback2")
  @body()
  // tslint:disable-next-line: variable-name
  @hook(
    async function (this: Inject, ctx: any) {
      expect(ctx.req).toBeTruthy();
      expect(ctx.res).toBeTruthy();
      expect(ctx.scope).toBeTruthy();
      expect(this.name === "inject");
      return false;
    },
    async function (this: Inject, ctx: any) {
      expect(this.name === "inject");
      this.fallbacked = true;
      ctx.res.end("Fallback!");
      return false;
    }
  )
  public async fallback2(req: any, res: any, scope: any) {
    expect(this.name === "inject");
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    expect(scope!.outer!.session!.user!.name === "ok");
    res.end("Inject All!");
  }

  @http("post", "/user/nofallback")
  @query()
  @inject(paginate(22, "query"))
  @body()
  // tslint:disable-next-line: variable-name
  @inject(async function (this: Inject, _req, res, scope: any) {
    expect(scope.query.page === 1);
    expect(scope.query.limit === 22);
    expect(scope.query.offset === 0);
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
  const instance = One.getInstance(
    Inject.prototype.constructor.name,
    "fallback"
  );
  expect(instance.fallback).toBeTruthy();
});

test("Should inject with compact mode", async () => {
  await PostText(
    port,
    { username: "aaaa", password: "sosodddso" },
    "Fallback!",
    "/user/fallback1",
    "localhost",
    "POST"
  );
  const instance = One.getInstance(
    Inject.prototype.constructor.name,
    "fallback1"
  );
  expect(instance.fallback).toBeTruthy();
});

test("Should hook with compact mode", async () => {
  await PostText(
    port,
    { username: "aaaa", password: "sosodddso" },
    "Fallback!",
    "/user/fallback2",
    "localhost",
    "POST"
  );
  const instance = One.getInstance(
    Inject.prototype.constructor.name,
    "fallback2"
  );
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
  const instance = One.getInstance(
    Inject.prototype.constructor.name,
    "fallback"
  );
  expect(instance.fallback).toBeTruthy();

  expect(parseStringToNumber("10") === 10).toBeTruthy();
});

afterAll(async () => {
  aex.server?.close();
});
