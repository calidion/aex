// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex, post, http, get } from "../../src/index";

import { GetText, PostText, initRandomPort } from "../../src/index";

class Http {
  private name = "hello";

  @http("", "/notstring/:name")
  public notstring(_req: any, res: any, _scope: any) {
    expect(this.name === "hello").toBeTruthy();
    res.end("Hello Aex!");
  }

  @http("aa", "/wrong/:name")
  public wrong(_req: any, res: any, _scope: any) {
    res.end("Hello Aex!");
  }

  @http("get", "/user/:name")
  public hello(_req: any, res: any, _scope: any) {
    res.end("Hello Aex!");
  }

  @http(["get", "post", "aaa"], "/user/login")
  public login(_req: any, res: any, _scope: any) {
    res.end("User Login!");
  }

  @http(["get", "post"], ["/", "/home"])
  public home(_req: any, res: any, _scope: any) {
    res.end("User Home!");
  }

  @http("*", "/user/all")
  public all(_req: any, res: any, _scope: any) {
    res.end("User All!");
  }

  @http("*", "/user/null")
  public no(_req: any, res: any, _scope: any) {
    res.end();
  }

  @http("/user/default")
  public simple(_req: any, res: any, _scope: any) {
    expect(this.name === "hello").toBeTruthy();
    res.end("User Simple!");
  }

  @get("/http/get")
  public async rawget(_req: any, res: any, _scope: any) {
    expect(this.name === "hello").toBeTruthy();
    res.end("Http Get!");
  }

  @post("/http/post")
  public async rawpost(_req: any, res: any, _scope: any) {
    expect(this.name === "hello").toBeTruthy();
    res.end("Http Post!");
  }
}

class TTT {}

const aex = new Aex();

aex.push(Http);
aex.push(TTT);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should decorate methods with single http method name", async () => {
  await GetText(port, "Hello Aex!", "/user/aoaoa");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Login!", "/user/login");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Login!", "/user/login", "localhost");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Login!", "/user/login", "localhost", {
    headers: { "Set-Cookie": "aa=a100" },
  });
});

test("Should decorate methods with array", async () => {
  await GetText(
    port,
    "User Login!",
    "/user/login",
    "localhost",
    {
      headers: { "Set-Cookie": "aa=a100" },
    },
    false
  );
});

test("Should decorate methods with array", async () => {
  await PostText(
    port,
    {},
    "User Login!",
    "/user/login",
    "localhost",
    "POST",
    {
      headers: { aa: 1 },
    },
    false
  );
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login", "localhost", "POST", {
    headers: { aa: 1 },
  });
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login", "localhost", "POST");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login", "localhost");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Home!");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Home!", "/");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Home!", "/home");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Home!", "/home");
});

test("Should decorate methods with all methods", async () => {
  await GetText(port, "User All!", "/user/all");
});

test("Should decorate methods with all methods", async () => {
  await GetText(port, "", "/user/null");
});

test("Should decorate methods with default method", async () => {
  await GetText(port, "User Simple!", "/user/default");
});

test("Should decorate methods with default method", async () => {
  await GetText(port, "Http Get!", "/http/get");
});

test("Should decorate methods with default method", async () => {
  await PostText(port, {}, "Http Post!", "/http/post");
});

afterAll(async () => {
  aex.server?.close();
});
