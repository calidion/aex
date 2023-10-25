// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";
import { api } from "../../src";

class API {
  public async register(ctx: any) {
    ctx.res.end("register");
  }

  public async login(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("login");
  }

  public async logout(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("logout");
  }
  public async remove(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("remove");
  }

  public async update(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("update");
  }

  @api("/user")
  public road(ctx: any) {
    // expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("API");
  }
}

class API1 {
  @api("/user1", {
    body: {
      type: "osos",
    },
  })
  public road(ctx: any) {
    ctx.res.end("get");
  }
}

const aex = new Aex();

aex.push(API, "Aex");
aex.push(API1, "Aex");
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
  const user = aex.instances[0];
  expect(user).toBeTruthy();
});

test("Should handle post", async () => {
  await PostText(
    port,
    { username: "aaa", action: "register" },
    "register",
    "/user",
    "localhost",
    "POST"
  );
});

test("Should handle get", async () => {
  await PostText(port, "", "API", "/user", "localhost", "GET");
});

test("Should handle patch", async () => {
  await PostText(
    port,
    { username: "aaa", action: "login" },
    "login",
    "/user",
    "localhost",
    "POST"
  );
});

test("Should handle put", async () => {
  await PostText(
    port,
    { username: "aaa", action: "remove" },
    "remove",
    "/user",
    "localhost",
    "POST"
  );
});

test("Should handle delete", async () => {
  await PostText(
    port,
    { username: "aaa", action: "update" },
    "update",
    "/user",
    "localhost",
    "POST"
  );
});

test("Should default method", async () => {
  await PostText(port, "", "get", "/user1", "localhost", "GET");
});

test("Should promote method missing", async () => {
  const res = await PostText(
    port,
    { username: "aaa", action: "profile" },
    "Not Implemented",
    "/user1",
    "localhost",
    "POST"
  );
  expect(res.statusCode).toBe(501);
});

afterAll(async () => {
  aex.server?.close();
});
