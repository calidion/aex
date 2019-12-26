import { Timer } from "./timer";

export class Scope {
  // tslint:disable-next-line:variable-name
  private _timer: Timer = new Timer();
  // tslint:disable-next-line:variable-name
  private _outer: { [x: string]: object } = {};
  // tslint:disable-next-line:variable-name
  private _inner: { [x: string]: object } = {};

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
