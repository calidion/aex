// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex } from "../../src/index";
import { body } from "../../src/index";
import { filter } from "../../src/index";
import { http } from "../../src/index";
import { query } from "../../src/index";

import {
  GetStatus,
  GetText,
  PostText,
  initRandomPort,
} from "../../src/util/request";

class User {
  protected name = "filter";

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
    expect(this.name === "filter");
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
    expect(this.name === "filter");
    expect(req.params.id === 111);
    if (req.query) {
      expect(req.query.page === 20);
    }
    res.end("User Id!");
  }

  @http("get", "/handled/:id")
  @query()
  @filter({
    query: {
      page: {
        type: "numeric",
      },
    },
    params: {
      id: {
        type: "numeric",
        required: true,
      },
    },
    fallbacks: {
      params: async function (this: any, _error: any, _req: any, res: any) {
        expect(this.name === "filter");
        res.end("Params failed!");
      },
    },
  })
  public async handled(req: any, res: any, scope: any) {
    expect(this.name === "filter");
    expect(req.params.id === 111);
    expect(scope.params.id === 111);
    if (scope.query) {
      expect(scope.query.page === 20);
      expect(req.query.page === 20);
    }
    res.end("Handled!");
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

test("Should filter query && params 1", async () => {
  await GetText(port, "User Id!", "/profile/111?page=20");
});

test("Should filter query && params 1", async () => {
  await GetText(port, "User Id!", "/profile/111");
});

test("should", async () => {
  await GetStatus(port, "/profile/ddd?page=aaa", 400);
});

test("should", async (done) => {
  setTimeout(() => {
    done();
  }, 1000);

  await GetStatus(port, "/profile/ddd", 400);
});

test("Should filter query && params 2", async () => {
  await GetText(port, "Handled!", "/handled/111?page=20");
});

test("Should filter query && params 3", async () => {
  await GetText(port, "Params failed!", "/handled/aaa?page=20");
});

afterAll(async () => {
  aex.server?.close();
});
