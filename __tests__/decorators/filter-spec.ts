// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { body } from "../../src/decorators/body";
import { filter } from "../../src/decorators/filter";
import { http } from "../../src/decorators/http";
import { query } from "../../src/decorators/query";

import { GetStatus, GetText, PostText } from "../../src/util/request";

class User {
  @http("post", "/user/login")
  @body()
  @filter({
    body: {
      username: {
        type: "string",
        required: true,
        minLength: 4,
        maxLength: 20,
      },
      password: {
        type: "string",
        required: true,
        minLength: 4,
        maxLength: 64,
      },
    },
  })
  public async login(req: any, res: any, _scope: any) {
    expect(req.body.username === "aaaa");
    expect(req.body.password === "sosodddso");
    res.end("User All!");
  }

  @http("get", "/profile/:id")
  @body()
  @query()
  @filter({
    query: {
      page: {
        type: "numeric",
        required: true,
      },
    },
    params: {
      id: {
        type: "numeric",
        required: true,
      },
    },
  })
  public async id(req: any, res: any, _scope: any) {
    expect(req.params.id === 111);
    // expect(req.query.page === 20);
    res.end("User Id!");
  }
}

beforeAll(() => {
  const user = new User();
  expect(user).toBeTruthy();
});

test("Should decorate methods with array", async () => {
  const aex = new Aex();
  aex.prepare();
  await PostText(
    aex,
    { username: "aaaa", password: "sosodddso" },
    "User All!",
    "/user/login",
    "localhost",
    "POST"
  );
});

test("Should filter query && params", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetText(aex, "User Id!", "/profile/111?page=20");
});

test("should", async () => {
  const aex = new Aex();
  aex.prepare();
  await GetStatus(aex, "/profile/ddd?page=aaa", 500);
});

test("should", async done => {
  const aex = new Aex();
  aex.prepare();
  setTimeout(() => {
    aex.server?.close();
    done();
  }, 1000);

  await GetStatus(aex, "/profile/ddd", 500);
});
