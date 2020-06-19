// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { body } from "../../src/decorators/body";
import { filter } from "../../src/decorators/filter";
import { http } from "../../src/decorators/http";
import { query } from "../../src/decorators/query";

import {
  GetStatus,
  GetText,
  PostText,
  initRandomPort,
} from "../../src/util/request";

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

  @http("get", "/handled/:id")
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

    failbacks: {
      params: async function(_req : any, res: any) {
        res.end("Params failed!");
      }
    }
  })
  public async handled(req: any, res: any, _scope: any) {
    expect(req.params.id === 111);
    // expect(req.query.page === 20);
    res.end("Handled!");
  }
}

const aex = new Aex();
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
  const user = new User();
  expect(user).toBeTruthy();
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

test("Should filter query && params", async () => {
  await GetText(port, "User Id!", "/profile/111?page=20");
});

test("should", async () => {
  await GetStatus(port, "/profile/ddd?page=aaa", 500);
});

test("should", async done => {
  setTimeout(() => {
    done();
  }, 1000);

  await GetStatus(port, "/profile/ddd", 500);
});

test("Should filter query && params", async () => {
  await GetText(port, "Handled!", "/handled/111?page=20");
});

test("Should filter query && params", async () => {
  await GetText(port, "Params failed!", "/handled/aaa?page=20");
});

afterAll(async () => {
  aex.server?.close();
});
