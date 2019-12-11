// import * as express from "express";
import * as session from 'express-session';
import { Aex, IAsyncMiddleware } from '../src/index';

import * as request from 'supertest';
import { promisify } from 'util';

test('Should compatible with express middlewares', done => {
  const aex = new Aex();
  let oldInvoke = false;
  const oldMiddleware = (_req: any, _res: any, next: any) => {
    oldInvoke = true;
    next();
  };

  const pOld = promisify(oldMiddleware);
  aex.use(pOld as IAsyncMiddleware);

  const asession = session({
    secret: 'keyboard cat',
  });
  const psession = promisify(asession);
  aex.use(psession as IAsyncMiddleware);

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
      res.send('Hello Aex!');
    },
  });
  aex.prepare();

  expect(result).toBeTruthy();

  request(aex.app)
    .get('/')
    .then((value: any) => {
      expect(value.text).toBe('Hello Aex!');
      done();
    });
});
