// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { http } from "../../src/decorators/http";

import { GetText, PostText } from "../../src/util/request";

class Exam {
  @http("", "/notstring/:name")
  public notstring(_req: any, res: any, _scope: any) {
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
}

beforeAll(() => {
  const exam = new Exam();
  expect(exam).toBeTruthy();
});

test("Should decorate methods with single http method name", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "Hello Aex!", "/user/aoaoa");
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "User Login!", "/user/login");
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "User Login!", "/user/login", "localhost");
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "User Login!", "/user/login", "localhost", {headers: {"Set-Cookie": "aa=a100"}});
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await PostText(aex, {}, "User Login!", "/user/login", "localhost", "POST");
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await PostText(aex, {}, "User Login!", "/user/login", "localhost");
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await PostText(aex, {}, "User Login!", "/user/login");
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await PostText(aex, {}, "User Home!");
});

test("Should decorate methods with all methods", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "User All!", "/user/all");
});

test("Should decorate methods with all methods", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "", "/user/null");
});
