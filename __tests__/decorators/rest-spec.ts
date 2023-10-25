// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex } from "../../src/index";

import { PostText, initRandomPort } from "../../src/index";
import { rest } from "../../src";

class Rest {
  public async get(ctx: any) {
    ctx.res.end("get");
  }

  public async post(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("post");
  }

  public async put(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("put");
  }
  public async patch(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("patch");
  }

  public async delete(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("delete");
  }

  @rest("/users")
  public road(ctx: any) {
    expect(ctx.scope.body.username).toBe("aaa");
    ctx.res.end("Rest!");
  }
}

class Rest1 {
  @rest("/users1", {
    body: {
      type: "osos",
    },
  })
  public road(ctx: any) {
    ctx.res.end("get");
  }
}

const aex = new Aex();

aex.push(Rest, "Aex");
aex.push(Rest1, "Aex");
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
    { username: "aaa", password: "sososo" },
    "post",
    "/users",
    "localhost",
    "POST"
  );
});

test("Should handle get", async () => {
  await PostText(port, "", "get", "/users", "localhost", "GET");
});

test("Should handle patch", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "patch",
    "/users",
    "localhost",
    "PATCH"
  );
});

test("Should handle put", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "put",
    "/users",
    "localhost",
    "PUT"
  );
});

test("Should handle delete", async () => {
  await PostText(
    port,
    { username: "aaa", password: "sososo" },
    "delete",
    "/users",
    "localhost",
    "DELETE"
  );
});

test("Should default method", async () => {
  await PostText(port, "", "get", "/users1", "localhost", "GET");
});

test("Should promote method missing", async () => {
  const res = await PostText(
    port,
    "",
    "Not Implemented",
    "/users1",
    "localhost",
    "DELETE"
  );
  expect(res.statusCode).toBe(501);
});

afterAll(async () => {
  aex.server?.close();
});
