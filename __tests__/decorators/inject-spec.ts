// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex } from "../../src/index";
import { body } from "../../src/index";
import { http } from "../../src/index";
import { inject } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";

class User {
  protected name = "inject";
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
    res.end("User All!");
  }
}

const aex = new Aex();
aex.push(User);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should decorate methods with array", async () => {
  await PostText(
    port,
    { username: "aaaa", password: "sosodddso" },
    "User All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

afterAll(async () => {
  aex.server?.close();
});
