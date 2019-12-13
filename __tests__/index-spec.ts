// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../src/aex";
import { responseText } from "./util";

test("Should have Aex available", () => {
  expect(Aex).toBeTruthy();
});

test("Should init Aex", () => {
  expect(new Aex()).toBeTruthy();
});

test("Should add http methods", async () => {
  const aex = new Aex();

  const result = aex.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.send("Hello Aex!");
    }
  });
  aex.prepare();

  expect(result).toBeTruthy();
  await responseText(aex, "Hello Aex!");
});

test("Should not able to add wrong http methods", () => {
  const aex = new Aex();

  let catched = false;
  try {
    aex.handle({
      method: "gett",
      url: "/",
      // tslint:disable-next-line:object-literal-sort-keys
      handler: async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.send("Hello Aex!");
      }
    });
  } catch (e) {
    expect(e.message === "wrong method: gett with url: /").toBeTruthy();
    catched = true;
  }

  expect(catched).toBeTruthy();
});

test("Should allow in request middlewares", async () => {
  const aex = new Aex();

  aex.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.send("Hello Aex!");
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.send("End!")!;
        return false;
      }
    ]
  });

  aex.handle({
    method: "get",
    url: "/users",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.send("Hello Aex!");
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.send("End!")!;
        return false;
      }
    ]
  });

  aex.prepare();
  await responseText(aex, "End!");
});

test("Should allow in request middlewares", async () => {
  const aex = new Aex();

  aex.handle({
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
      expect(scope.outter).toBeTruthy();
      expect(scope.inner).toBeTruthy();
      scope.inner.a = 100;
      scope.outter.a = 120;
      expect(scope.inner.a === 100).toBeTruthy();
      expect(scope.outter.a === 120).toBeTruthy();
      let catched = false;
      try {
        scope.outter = {};
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
      }
    ]
  });
  aex.prepare();

  await responseText(aex, "Hello world!");
});

test("Should allow general middlewares", async () => {
  const aex = new Aex();

  aex.use(
    async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.send("General Middlewares!")!;
      return false;
    }
  );

  aex.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.send("Hello Aex!");
    },
    middlewares: [
      async (
        // tslint:disable-next-line:variable-name
        _req: any,
        res: any
      ) => {
        res.send("End!")!;
        return false;
      }
    ]
  });
  aex.prepare();
  await responseText(aex, "General Middlewares!");
});

test("Should start http methods", async () => {
  const aex = new Aex();
  const server = await aex.start();

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

  const result = aex.handle({
    method: "get",
    url: "/",
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any,
      res: any
    ) => {
      res.send("Hello Aex!");
    }
  });
  aex.prepare();

  expect(result).toBeTruthy();

  await responseText(aex, "Hello Aex!");

});
