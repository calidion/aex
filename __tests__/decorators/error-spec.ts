// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { http } from "../../src/decorators/http";

import { PostText, initRandomPort } from "../../src/util/request";
import { error } from "../../src/decorators/error";

class User {
  protected hello = "error";

  @http("post", "/user/login")
  @error({
    Hello: {
      code: 100,
      messages: {},
    },
    I: {
      Love: {
        You: {
          code: 1,
          messages: {
            "en-US": "I Love U!",
            "zh-CN": "我爱你！",
          },
        },
      },
    },
    Me: {
      alias: "I",
    },
  })
  public all(_req: any, res: any, scope: any) {
    expect(this.hello === "error").toBeTruthy();
    expect(scope.error.Hello).toBeTruthy();
    expect(scope.error.ILoveYou).toBeTruthy();
    expect(scope.error.MeLoveYou).toBeTruthy();

    expect(scope.error.HELLO === undefined).toBeTruthy();
    expect(scope.error.I_LOVE_YOU === undefined).toBeTruthy();
    expect(scope.error.ME_LOVE_YOU === undefined).toBeTruthy();
    res.end("User All!");
  }

  @http("post", "/user/ok")
  @error(
    {
      Hello: {
        code: 100,
        messages: {},
      },
      I: {
        Love: {
          You: {
            code: 1,
            messages: {
              "en-US": "I Love U!",
              "zh-CN": "我爱你！",
            },
          },
        },
      },
      Me: {
        alias: "I",
      },
    },
    true
  )
  public road(_req: any, res: any, scope: any) {
    expect(this.hello === "error").toBeTruthy();
    expect(scope.error.HELLO).toBeTruthy();
    expect(scope.error.I_LOVE_YOU).toBeTruthy();
    expect(scope.error.ME_LOVE_YOU).toBeTruthy();
    expect(scope.error.Hello === undefined).toBeTruthy();
    expect(scope.error.ILoveYou === undefined).toBeTruthy();
    expect(scope.error.MeLoveYou === undefined).toBeTruthy();
    expect(scope.error.AAA === undefined).toBeTruthy();
    res.end("User Road!");
  }

  @http("post", "/user/none")
  @error()
  public none(_req: any, res: any, scope: any) {
    expect(scope.error.AAA === undefined).toBeTruthy();
    res.end("User None!");
  }
}

const aex = new Aex();
aex.push(User);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should use decorator error", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "User All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

test("Should use decorator error with upper case", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "User Road!",
    "/user/ok",
    "localhost",
    "POST"
  );
});

test("Should use decorator error with no error defined", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "User None!",
    "/user/none",
    "localhost",
    "POST"
  );
});

afterAll(async () => {
  aex.server?.close();
});
