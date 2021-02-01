/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import { Router } from "./router";

export class One {
  public static cache: any[] = [];
  public static instances: any = {};
  public static instance() {
    if (One.router) {
      return One.router;
    }
    One.router = new Router();
    return One.router;
  }

  public static reset() {
    One.router = new Router();
    One.cache = [];
    One.instances = {};
  }

  public static putInstance(aClass: any, method: any, instance: any) {
    if (!One.instances[aClass]) {
      One.instances[aClass] = {};
    }
    if (One.instances[aClass][method]) {
      throw new Error("Duplicated instance found!");
    }
    One.instances[aClass][method] = instance;
  }

  public static getInstance(aClass: any, method: any) {
    if (!One.instances[aClass]) {
      return null;
    }
    return One.instances[aClass][method];
  }
  private static router: Router | null;
}
