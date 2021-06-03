// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex } from "../../src/index";
import { http } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";
import { error } from "../../src/index";

class Error {
  protected hello = "error";

  @http("post", "/user/login")
  @error({
    lang: "zh-CN",
    Hello: {
      code: 100,
      messages: {
        "en-US": "Hello!",
        "zh-CN": "你好！",
      },
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
    const { Hello } = scope.error;
    const hello = new Hello();
    const hello1 = new Hello("en-US");
    expect(hello.message === "你好！");
    expect(hello1.message === "Hello!");
    res.end("Error All!");
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
    res.end("Error Road!");
  }

  @http("post", "/user/none")
  @error()
  public none(_req: any, res: any, scope: any) {
    expect(scope.error.AAA === undefined).toBeTruthy();
    res.end("Error None!");
  }
}

const aex = new Aex();
aex.push(Error);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should use decorator error", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "Error All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

test("Should use decorator error with upper case", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "Error Road!",
    "/user/ok",
    "localhost",
    "POST"
  );
});

test("Should use decorator error with no error defined", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "Error None!",
    "/user/none",
    "localhost",
    "POST"
  );
});

afterAll(async () => {
  aex.server?.close();
});
