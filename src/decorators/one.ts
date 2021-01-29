/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { Router } from "../router";

export class One {
  public static instance() {
    return this.router;
  }
  private static router: Router = new Router();
}
