/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import * as debug from "debug";
import { Timer } from "./scoped/timer";

export class Scope {
  // tslint:disable-next-line:variable-name
  private _timer: Timer = new Timer();
  // tslint:disable-next-line:variable-name
  private _outer: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _inner: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _error: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _body: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _session: { [x: string]: object } = {};

  // tslint:disable-next-line:variable-name
  private _query: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _params: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _files: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _engine: { [x: string]: object } = {};

  get engine() {
    return this._engine;
  }

  set engine(value) {
    this._engine = value;
  }

  get time() {
    return this._timer;
  }

  get outer() {
    return this._outer;
  }

  get inner() {
    return this._inner;
  }

  get error() {
    return this._error;
  }

  get global() {
    return this._outer;
  }

  get local() {
    return this._inner;
  }

  get body() {
    return this._body;
  }
  get session() {
    return this._session;
  }
  set session(value) {
    this._session = value;
  }
  get query() {
    return this._query;
  }

  get params() {
    return this._params;
  }

  get files() {
    return this._files;
  }

  public reset() {
    this._body = {};
    this._session = {};
    this._query = {};
    this._inner = {};
    this._params = {};
    this._error = {};
    this._files = {};
    this._timer.reset();
    this._engine = {};
  }

  get debug() {
    return debug;
  }
}
