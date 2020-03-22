// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { http } from "../../src/decorators/http";
import { body } from "../../src/decorators/body";
import { One } from "../../src/decorators/one";

import { PostText } from "../../src/util/request";

class User {
  @http("post", "/user/login")
  @body()
  public all(req: any, res: any, _scope: any) {
    expect(req.body.username === "aaa");
    expect(req.body.password === "sososo");
    res.end("User All!");
  }

  @http("post", "/user/ok")
  @body("roodod")
  public road(_req: any, res: any) {
    res.end("User Road!");
  }
}

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  const router = One.instance();
  aex.use(router.toMiddleware());

  const user = new User();

  expect(user).toBeTruthy();

  await PostText(aex, {username: "aaa", password: "sososo"}, "User All!", "/user/login", "localhost", "POST");
});
