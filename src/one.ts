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
    One.instances = {};
  }

  public static putInstance(aClassName: string, method: string, instance: any) {
    if (!One.instances[aClassName]) {
      One.instances[aClassName] = {};
    }
    if (One.instances[aClassName][method]) {
      throw new Error("Duplicated instance found!");
    }
    One.instances[aClassName][method] = instance;
  }

  public static getInstance(aClassName: string, method: string) {
    if (!One.instances[aClassName]) {
      return null;
    }
    return One.instances[aClassName][method];
  }
  private static router: Router | null;
}
