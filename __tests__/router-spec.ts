// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from '../src/aex';
import { responseRoutedText, responseStatus } from './util';

test('Should parse params', async () => {
  const aex = new Aex();

  const result = aex.handle({
    method: 'get',
    url: '/user/:name',
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (req: any, res: any) => {
      expect(req.params).toBeTruthy();
      res.end('Hello Aex!');
    },
  });
  aex.prepare();

  expect(result).toBeTruthy();
  await responseRoutedText(aex, '/user/aoaoa', 'Hello Aex!');
});

test('Should return 404 when no route found!', async () => {
  const aex = new Aex();

  const result = aex.handle({
    method: 'get',
    url: '/',
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (req: any, res: any) => {
      expect(req.params).toBeTruthy();
      res.end('Hello Aex!');
    },
  });
  aex.prepare();

  expect(result).toBeTruthy();
  await responseStatus(aex, '/user/aoaoa', 404);
});

test('Should return 404 when no route found!', async () => {
  const aex = new Aex();

  aex.prepare();
  await responseStatus(aex, '/user/aoaoa', 404);
});
