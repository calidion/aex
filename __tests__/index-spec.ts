// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../src/core";
import { Router } from "../src/router";
import { GetStatusWithAex, GetTextWithAex } from "../src/util/request";

test("Should have Aex available", () => {
  expect(Aex).toBeTruthy();
});

test("Should init Aex", () => {
  expect(new Aex()).toBeTruthy();
});

test("Should add http methods", async () => {
  const aex = new Aex();

  const router = new Router();

  router.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.end("Hello Aex!");
    },
  });
  aex.use(router.toMiddleware());

  await GetTextWithAex(aex, "Hello Aex!");
});

test("Should not able to add wrong http methods", () => {
  const router = new Router();
  let catched = false;
  try {
    router.handle({
      method: "gett",
      url: "/",
      // tslint:disable-next-line:object-literal-sort-keys
      handler: async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.end("Hello Aex!");
      },
    });
  } catch (e) {
    expect(e.message === "wrong method: gett with url: /").toBeTruthy();
    catched = true;
  }

  expect(catched).toBeTruthy();
});

test("Should allow in request middlewares", async () => {
  const aex = new Aex();
  const router = new Router();

  router.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.end("Hello Aex!");
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.end("End!")!;
        return false;
      },
    ],
  });

  router.handle({
    method: "get",
    url: "/users",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.end("Hello Aex!");
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.end("End!")!;
        return false;
      },
    ],
  });

  aex.use(router.toMiddleware());
  await GetTextWithAex(aex, "End!");
});

test("Should allow in request middlewares", async () => {
  const aex = new Aex();
  const router = new Router();

  router.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any,
      scope: any
    ) => {
      res.write(" world!");
      expect(scope.outer).toBeTruthy();
      expect(scope.inner).toBeTruthy();
      expect(scope.body).toBeTruthy();
      expect(scope.session).toBeTruthy();
      expect(scope.error).toBeTruthy();
      expect(scope.query).toBeTruthy();
      expect(scope.debug).toBeTruthy();
      scope.inner.a = 100;
      scope.outer.a = 120;
      expect(scope.inner.a === 100).toBeTruthy();
      expect(scope.outer.a === 120).toBeTruthy();
      let catched = false;

      const { debug } = scope;
      const logger = debug("aex:scope");
      logger("this is a debugging info");
      try {
        scope.outer = {};
      } catch (e) {
        catched = true;
      }

      expect(catched).toBeTruthy();

      catched = false;
      try {
        scope.inner = {};
      } catch (e) {
        catched = true;
      }

      expect(catched).toBeTruthy();

      catched = false;
      try {
        scope.time = {};
      } catch (e) {
        catched = true;
      }

      expect(catched).toBeTruthy();

      expect(scope.time.started).toBeTruthy();

      catched = false;
      try {
        scope.time.started = "";
      } catch (e) {
        catched = true;
      }

      expect(catched).toBeTruthy();

      catched = false;
      try {
        scope.time.passed = {};
      } catch (e) {
        catched = true;
      }

      expect(catched).toBeTruthy();

      expect(scope.time.passed > 0).toBeTruthy();
      res.end();
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.write("Hello");
      },
    ],
  });
  aex.use(router.toMiddleware());

  await GetTextWithAex(aex, "Hello world!");
});

test("Should allow general middlewares", async () => {
  const aex = new Aex();
  const router = new Router();

  aex.use(
    async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.end("General Middlewares!")!;
      return false;
    }
  );

  router.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.end("Hello Aex!");
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.end("End!")!;
        return false;
      },
    ],
  });
  aex.use(router.toMiddleware());

  await GetTextWithAex(aex, "General Middlewares!");
});

test("Should start http methods", async () => {
  const aex = new Aex();
  const port = 10000 + Math.floor(Math.random() * 1000);
  const server = await aex.start(port);

  expect(server === aex.server).toBeTruthy();

  let catched = false;

  try {
    await aex.start(80);
  } catch (e) {
    catched = true;
  }
  server.close();

  expect(catched).toBeTruthy();
});

test("Should add http methods", async () => {
  const aex = new Aex();
  const router = new Router();

  router.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.end("Hello Aex!");
    },
  });

  aex.use(router.toMiddleware());
  await GetTextWithAex(aex, "Hello Aex!");
});

test("Should return 404 when no route found!", async () => {
  const aex = new Aex();
  await GetStatusWithAex(aex, "/user/aoaoa", 404);
});
