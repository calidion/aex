/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

export class Timer {
  // tslint:disable-next-line:variable-name
  private _started: Date;
  constructor() {
    this._started = new Date();
  }
  public reset() {
    this._started = new Date();
  }
  get started() {
    return this._started;
  }
  get passed(): number {
    return new Date().getTime() - this._started.getTime();
  }
}
