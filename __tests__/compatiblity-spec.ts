import { Aex } from "../src/index";

import { Router } from "../src/index";
import { toAsyncMiddleware } from "../src/index";
import { GetTextWithAex } from "../src/index";
import { copyByKey } from "../src/util/kv";

test("Should compatible with express middlewares", async () => {
  const aex = new Aex();
  let oldInvoke = false;
  const oldMiddleware = (_req: any, _res: any, next: any) => {
    oldInvoke = true;
    next();
  };

  const pOld = toAsyncMiddleware(oldMiddleware);
  aex.use(pOld);

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
      expect(oldInvoke).toBeTruthy();
      res.end("Hello Aex!");
    },
  });

  aex.use(router.toMiddleware());

  await GetTextWithAex(aex, "Hello Aex!", "");
});

test("Should test copyByKey", async () => {
  let a = {};
  let b = { function() {} };
  copyByKey(b, a);
});
