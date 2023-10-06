/**
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 * Class One is used to store global information that decorators need which is
 * information about decorated classes, methods and members.
 */
import { Router } from "./router";

export class One {
  public static cache: any[] = [];
  public static instances: { [x: string]: any } = {};

  public static routers: { [x: string]: Router } = {};

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
