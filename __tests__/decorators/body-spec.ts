// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex, IACompactedAsyncMiddeleWare } from "../../src/index";
import { body } from "../../src/index";
import { http } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";

class Body {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  @http("post", "/user/login1", true)
  @body()
  public allCompacted(context: IACompactedAsyncMiddeleWare) {
    const { req, res, scope } = context;
    // console.log(context);
    expect(this.name === "Aex");
    expect(req.body.username === "aaa");
    expect(req.body.password === "sososo");
    expect(scope).toBeTruthy();
    expect(scope?.body).toBeTruthy();
    expect((scope?.body as any).username === "aaa");
    expect((scope?.body as any).password === "sososo");
    res.end("Body All!");
  }

  @http("post", "/user/login")
  @body()
  public all(req: any, res: any, scope: any) {
    expect(this.name === "Aex");
    expect(req.body.username === "aaa");
    expect(req.body.password === "sososo");
    expect(scope.body.username === "aaa");
    expect(scope.body.password === "sososo");
    res.end("Body All!");
  }

  @http("post", "/user/ok")
  @body("roodod")
  public road(_req: any, res: any) {
    expect(this.name === "Aex");
    res.end("Body Road!");
  }
}

const aex = new Aex();

aex.push(Body, "Aex");
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
  const user = aex.instances[0];
  expect(user).toBeTruthy();
  expect(user.name === "Aex").toBeTruthy();
});

test("Should decorate methods with array", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "Body All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

test("Should decorate methods with array", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "Body All!",
    "/user/login1",
    "localhost",
    "POST"
  );
});

test("Should not push again a calss", async () => {
  let catched = false;
  try {
    aex.push(Body);
  } catch (e) {
    catched = true;
    expect(e.message).toBe("Duplicated class found!");
  }
  expect(catched).toBeTruthy();
});

afterAll(async () => {
  aex.server?.close();
});
