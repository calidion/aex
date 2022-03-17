// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { Aex, GetText, template } from "../../src/index";
import { http } from "../../src/index";

import * as nunjucks from "nunjucks";
import * as pug from "pug";

import { resolve } from "path";

import { initRandomPort } from "../../src/index";
import { existsSync } from "fs";

class Template {
  constructor() {}

  @http("/one")
  @template((path) => {
    const loader = new nunjucks.FileSystemLoader([path], {});
    const env = new nunjucks.Environment(loader, {
      autoescape: false,
    });
    return env;
  }, resolve(__dirname, "./views"))
  public async name(_: any, res: any) {
    res.render("index.html", { hello: "Hello1" });
  }

  @http("/two")
  @template((path) => {
    const loader = new nunjucks.FileSystemLoader([path], {});
    const env = new nunjucks.Environment(loader, {
      autoescape: false,
    });
    return env;
  }, resolve(__dirname, "./views"))
  public async name1(_: any, res: any, scope: any) {
    res.end(scope.engine.render("index.html", { hello: "Hello2" }));
  }

  @http("/pug")
  @template((path) => {
    const engine: any = {};
    engine.render = function (name: string, data: any) {
      let file = name;
      if (!existsSync(name)) {
        if (!existsSync(resolve(path, name))) {
          throw new Error("File Not Found: " + resolve(path, name));
        } else {
          file = resolve(path, name);
        }
      }
      return pug.renderFile(file, data);
    };
    return engine;
  }, resolve(__dirname, "./views"))
  public async name2(_: any, res: any, scope: any) {
    res.end(scope.engine.render("index.pug", { hello: "Hello3" }));
  }
}

const aex = new Aex();

aex.push(Template);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should get template text", async () => {
  await GetText(port, "Hello1 World!", "/one", "localhost");
  await GetText(port, "Hello2 World!", "/two", "localhost");
  await GetText(port, "<p>Hello3 World!</p>", "/pug", "localhost");
});

afterAll(async () => {
  aex.server?.close();
});
