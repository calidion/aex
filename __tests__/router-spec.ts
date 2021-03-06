// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex } from "../src/index";
import { Router } from "../src/index";
import { GetTextWithAex, GetStatusWithAex } from "../src/index";
import { IncomingMessage } from "http";

test("Should parse params", async () => {
  const aex = new Aex();
  const router = new Router();

  router.handle({
    method: "get",
    url: "/user/:name",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (req: any, res: any) => {
      expect(req.params).toBeTruthy();
      res.end("Hello Aex!");
    },
  });
  aex.use(router.toMiddleware());

  await GetTextWithAex(aex, "Hello Aex!", "/user/aoaoa");
});

test("Should return 404 when no route found!", async () => {
  const aex = new Aex();
  const router = new Router();

  router.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (req: any, res: any) => {
      expect(req.params).toBeTruthy();
      res.end("Hello Aex!");
    },
  });

  aex.use(router.toMiddleware());

  await GetStatusWithAex(aex, "/user/aoaoa", 404);
});

test("Should return 404 when no route found!", async () => {
  const aex = new Aex();
  const router = new Router();
  aex.use(router.toMiddleware());

  await GetStatusWithAex(aex, "/user/aoaoa", 404);
});

test("Should return use http methods directly", async () => {
  const aex = new Aex();
  const router = new Router();

  router.get(["/user/:name", "/user/:id"], async (req: any, res: any) => {
    expect(req.params).toBeTruthy();
    res.end("Hello Aex!");
  });
  aex.use(router.toMiddleware());

  await GetTextWithAex(aex, "Hello Aex!", "/user/aoaoa");
});

test("Should Request no route", async () => {
  const aex = new Aex();
  const router = new Router();

  router.get(["/user/:name", "/user/:id"], async (req: any, res: any) => {
    expect(req.params).toBeTruthy();
    res.end("Hello Aex!");
  });
  aex.use(router.toMiddleware());
  const res = await GetStatusWithAex(aex, "", 404);
  expect(res instanceof IncomingMessage).toBeTruthy();
});
