/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { Router } from "../router";

export class One {
  public static cache: any[] = [];
  public static instance() {
    return One.router;
  }
  private static router: Router = new Router();
}
