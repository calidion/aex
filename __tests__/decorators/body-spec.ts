// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { body } from "../../src/decorators/body";
import { http } from "../../src/decorators/http";

import { PostText, initRandomPort } from "../../src/util/request";

class User {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  @http("post", "/user/login")
  @body()
  public all(req: any, res: any, scope: any) {
    expect(req.body.username === "aaa");
    expect(req.body.password === "sososo");
    expect(scope.body.username === "aaa");
    expect(scope.body.password === "sososo");
    res.end("User All!");
  }

  @http("post", "/user/ok")
  @body("roodod")
  public road(_req: any, res: any) {
    res.end("User Road!");
  }
}

const aex = new Aex();

aex.push(User, "Aex");
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
    "User All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

afterAll(async () => {
  aex.server?.close();
});
