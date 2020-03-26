// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { body } from "../../src/decorators/body";
import { http } from "../../src/decorators/http";
import { inject } from "../../src/decorators/inject";
import { One } from "../../src/decorators/one";

import { PostText } from "../../src/util/request";

class User {
  @http("post", "/user/login")
  @body()
  // tslint:disable-next-line: variable-name
  @inject(async (_req, _res, scope) => {
    if (scope) {
      scope.outer.session = {
        user: {
          name: "ok"
        }
      };
    }
  })
  public async login(req: any, res: any, scope: any) {
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    expect(scope!.outer!.session!.user!.name === "ok");
    res.end("User All!");
  }
}

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  const router = One.instance();
  aex.use(router.toMiddleware());

  const user = new User();

  expect(user).toBeTruthy();

  await PostText(
    aex,
    { username: "aaaa", password: "sosodddso" },
    "User All!",
    "/user/login",
    "localhost",
    "POST"
  );
});
