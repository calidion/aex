import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from '../src/index';

import * as request from 'supertest';


test('Should have Aex available', () => {
  expect(Aex).toBeTruthy();
});


test('Should init Aex', () => {
  expect(new Aex()).toBeTruthy();
  const app = express();
  expect(new Aex(app)).toBeTruthy();
});


test('Should add http methods', (done) => {
  const aex = new Aex();

  aex.handle({
    method: 'get',
    url: '/',
    // tslint:disable-next-line:object-literal-sort-keys
    handler: async (
      // tslint:disable-next-line:variable-name
      _req: any, res: any) => {
      res.send("Hello Aex!");
    }
  });
  aex.prepare();

  request(aex.app).get('/').then((value: any) => {
    expect(value.text).toBe("Hello Aex!");
    done();
  });
});