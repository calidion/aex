import * as session from 'express-session';
import { Aex } from '../src/aex';

import { toAsyncMiddleware } from '../src/util';
import { responseText } from './util';

test('Should compatible with express middlewares', async () => {
  const aex = new Aex();
  let oldInvoke = false;
  const oldMiddleware = (_req: any, _res: any, next: any) => {
    oldInvoke = true;
    next();
  };

  const pOld = toAsyncMiddleware(oldMiddleware);
  aex.use(pOld);

  const asession = session({
    secret: 'keyboard cat',
  });
  const psession = toAsyncMiddleware(asession);
  aex.use(psession);

  const result = aex.handle({
    method: 'get',
    url: '/',
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      req: any,
      res: any
    ) => {
      expect(oldInvoke).toBeTruthy();
      expect(req.session).toBeTruthy();
      res.end('Hello Aex!');
    },
  });
  aex.prepare();

  expect(result).toBeTruthy();

  await responseText(aex, 'Hello Aex!');
});
