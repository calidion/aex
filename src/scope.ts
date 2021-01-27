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

  get body() {
    return this._body;
  }
  get session() {
    return this._session;
  }
  get query() {
    return this._query;
  }

  get params() {
    return this._params;
  }

  reset() {
    this._body = {};
    this._session = {};
    this._query = {};
    this._inner = {};
    this._params = {};
    this._error = {};
    this._timer.reset();
  }
}
