import { Timer } from "./timer";

export class Scope {
  // tslint:disable-next-line:variable-name
  private _timer: Timer = new Timer();
  // tslint:disable-next-line:variable-name
  private _outer: object = {};
  // tslint:disable-next-line:variable-name
  private _inner: object = {};

  get time() {
    return this._timer;
  }

  get outer() {
    return this._outer;
  }

  get inner() {
    return this._inner;
  }
}
