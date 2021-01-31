[![Build Status](https://travis-ci.com/calidion/aex.svg?branch=master)](https://travis-ci.com/calidion/aex)
[![Coverage Status](https://coveralls.io/repos/github/calidion/aex/badge.svg?branch=master)](https://coveralls.io/github/calidion/aex?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Downloads][downloads-image-month]][npm-url]
[![Dependency Status][daviddm-image]][daviddm-url]

# AEX

A simple, easy to use, decorated, scoped, object-oriented web server, with async linear middlewares and no more callbacks in middlewares.

It is a web framework for typescript and nodejs.

It is also an example:

1. To show that callbacks are not needed with promise/async/await.
2. To use middlewares in a linear way instead of stacked way which is insecure.
   > For the stacked middleware model will carry response back to the top most so called middleware pushed, where every middleware can access to the body returned.
3. To pass some vairiables through middlewares and to the final handler.

# Content

Aex is built and powerized by the following parts.

1. [Core functions](#core-functions)
2. [Decorators](#decorators)
3. [Usage with no decorator](#usage)
4. [Websocket support](#websocket-support)
5. [Middlewares](#middlewares)
6. [Scope](#scope)
7. [Express Middleware Integration](#use-middlewares-from-expressjs)
8. [Get the web server](#accessable-members)

# Philosophy

1. Keep in mind to separate web logic from business logic, and only develope for web logic.
2. Focus soly on web flow.
3. Simplify the way to make good web projects.
4. Consider web interactions as phrased straight lines, which we call it Web Straight Line.
5. No MVC, soly focusing on architecture which is the web logic.

# Quick Start

## Add @aex/core to your project

```sh
npm install @aex/core # or npm i @aex/core
```

or if you use yarn

```sh
yarn add @aex/core
```

## Use @http to enable web processing ability

```ts
import { Aex, http } from "@aex/core";

class HelloAex {
  private message = "aex";
  @http("*", "*")
  public all(_req: any, res: any, _scope: any) {
    res.end("Hello " + this.message + "!");
  }
}
```

## Create aex instance

```ts
// create Aex instance
const aex = new Aex();
```

## Add your web handler to aex with parameters

```ts
// push your controller into aex
aex.push(HelloAex);
```

## Prepare aex enviroment

```ts
aex.prepare();
```

### Start aex web server

```ts
aex.start(8080).then();
// or
await aex.start(8080);
```

# Install

```sh
npm i @aex/core
```

or

```sh
yarn add @aex/core
```

# Core functions

## prepare

`prepare` is used here to init middlewares and controllers if controllers are pushed into the `aex` instance. It takes no parameter and return the `aex` instance. so you can invoke the `start` function of aex.

```ts
await aex.prepare().start();
// or
aex
  .prepare()
  .start()
  .then(() => {
    // further processing
  });
```

## start

`start` function is used to bootstrap the server with cerntain port. It takes three parameters:

1. `port` the port taken by the web server, default to 3000
2. `ip` the ip address where the port bind to, default to localhost
3. `prepare` prepare middlewares or not, used when middlewares are not previously prepared

## push

push a controller class to aex, it takes on parameter and other arguments:

1. aClass: a class prototype.
2. args: takes the rest arguments for the class constructor

```ts
aex.push(HelloAex);
//or
aex.push(HelloAex, parameter1, parameter2, ..., parameterN);
// will be invoked as `new HelloAlex(parameter1, parameter2, ..., parameterN)`
```

## use

add middlewares to aex, see detailed explanation in [middlewares](#middlewares)

# Decorators

Aex is simplified by decorators, so you should be familiar with decorators to full utilize aex.

Decorators will be enriched over time. Currently aex provides 6 most important decorators. They are
`@inject`, `@http`, `@body`, `@query`, `@filter`, `@error`.

1. `@inject` is the generate purpose decorator for client users to customize their handling. Users can inject any middleware with `@inject`;

2. `@http` defines your http handler with a member function, it is the most important and fundamental decorator for `aex` as a http web server.
3. `@body` defines your way to parse your body.
4. `@query` extract http query into `req.query` and `scope.query`;
5. `@filter` fiters and validates data from http requests, takes `body`, `params` and `query` types only.
6. `@error` defines scoped errors

## @http

Aex provides the `@http` decorator to ease the way http requests being handled by classes. It is very simple and intuitive.

### Define a class with it's methods decorated by `@http`

The member methods are of `IAsyncMiddleware` type as well.

`@http` takes two parameter:

1. http method name(s)
2. url(s);

You can just pass url(s) if you use http `GET` method only.

```ts
import { http } from "@aex/core";

class User {
  @http("get", ["/profile", "/home"])
  profile(req, res, scope) {}

  @http(["get", "post"], "/user/login")
  login(req, res, scope) {}

  @http("post", "/user/logout")
  logout(req, res, scope) {}

  @http("/user/:id")
  info(req, res, scope) {}

  @http(["/user/followers", "/user/subscribes"])
  followers(req, res, scope) {}
}
```

### Get router from One

```ts
import { One } from "@aex/core";
const router = One.instance();
```

### New the class

You need to create an instance of your class for request being processed.

```ts
const user = new User();
// do some initialization
```

### Start Aex server

```ts
import { Aex } from "@aex/core";
const aex = new Aex();
aex.use(router.toMiddleware());
aex.start();
```

## @body

Decorator @body provides a simple way to process data with body parser.

@body accept body parser package's function and its options, and they are optional.

```ts
@body("urlencoded", { extended: false })
```

and should succeed to @http decorator.

```ts
import { http } from "@aex/core";

class User {
  @http("post", "/user/login")
  @body("urlencoded", { extended: false })
  login(req, res, scope) {}

  @http("post", "/user/logout")
  @body()
  login(req, res, scope) {}
}
```

You may look up npm package `body-parser` for detailed usage.

## @query

Decorator @query will parse query for you. After @query you will have `req.query` to use.

```ts
  @http("get", "/profile/:id")
  @query()
  public async id(req: any, res: any, _scope: any) {
    // get /profile/111?page=20
    req.query.page
    // 20
  }
```

## @filter

Decorator @filter will filter `body`, `params` and `query` data for you.

Reference [node-form-validator](!https://github.com/calidion/node-form-validator) for detailed usage.

```ts
class User {
  @http("post", "/user/login")
  @body()
  @filter({
    body: {
      username: {
        type: "string",
        required: true,
        minLength: 4,
        maxLength: 20
      },
      password: {
        type: "string",
        required: true,
        minLength: 4,
        maxLength: 64
      }
    },
    fallbacks: {
      body: async(req, res, scope) {
        res.end("Body parser failed!");
      }
    }
  })
  public async login(req: any, res: any, _scope: any) {
    // req.body.username
    // req.body.password
  }

  @http("get", "/profile/:id")
  @body()
  @query()
  @filter({
    query: {
      page: {
        type: "numeric",
        required: true
      }
    },
    params: {
      id: {
        type: "numeric",
        required: true
      }
    }
  })
  public async id(req: any, res: any, _scope: any) {
    // req.params.id
    // req.query.page
  }
}
```

## @error

Decorator `@error` will generate errors for you.

Reference [errorable](!https://github.com/calidion/errorable) for detailed usage.

`@error` take two parameters exactly what function `Generator.generate` takes.

```ts
class User {
  @http("post", "/error")
  @error({
    I: {
      Love: {
        You: {
          code: 1,
          messages: {
            "en-US": "I Love U!",
            "zh-CN": "我爱你！",
          },
        },
      },
    },
    Me: {
      alias: "I",
    },
  })
  public road(_req: any, res: any, scope: any) {
    const { ILoveYou } = scope.error;
    // throw new ILoveYou('en-US');
    // throw new ILoveYou('zh-CN');
    res.end("User Error!");
  }
}
```

## @inject

Inject any middleware when necessary. But you should be careful with middlewares' order.

```ts
class User {
  @http("post", "/user/login")
  @body()
  @inject(async (req, res, scope) => {
      req.session = {
        user: {
          name: "ok"
        }
      };
  })
  public async login(req: any, res: any, scope: any) {
    // req.session.user.name
    // ok
    ...
  }
}
```

# Usage

## 1. Create an Aex instance

```ts
const aex = new Aex();
```

## 2. Create a Router

```ts
const router = new Router();
```

## 2. Setup the option for handler

```ts
router.get("/", async (req, res, scope) => {
  // request processing time started
  console.log(scope.time.stated);
  // processing time passed
  console.log(scope.time.passed);
  res.end("Hello Aex!");
});
```

## 3. Use router as an middleware

```ts
aex.use(router.toMiddleware());
```

## 4. Start the server

```ts
const port = 3000;
const host = "localhost";
const server = await aex.start(port, host);
// server === aex.server
```

# Websocket support

## Simple example

1. Create a `WebSocketServer` instance

```ts
const aex = new Aex();
const server = await aex.start();
const ws = new WebSocketServer(server);
```

2. Get handler for one websocket connection

```ts
ws.on(WebSocketServer.ENTER, (handler) => {
  // process/here
});
```

3. Listen on user-customized events

```ts
ws.on(WebSocketServer.ENTER, (handler) => {
  handler.on("event-name", (data) => {
    // data.message = "Hello world!"
  });
});
```

4. Send message to browser / client

```ts
ws.on(WebSocketServer.ENTER, (handler) => {
  handler.send("event-name", { key: "value" });
});
```

5. New browser/client WebSocket object

```ts
const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");
wsc.on("open", function open() {
  wsc.send("");
});
```

6. Listen on user-customized events

```ts
ws.on("new-message", () => {
  // process/here
});
```

7. Sending ws message in browser/client

```ts
const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");
wsc.on("open", function open() {
  wsc.send(
    JSON.stringify({
      event: "event-name",
      data: {
        message: "Hello world!",
      },
    })
  );
});
```

8. Use websocket middlewares

```ts
ws.use(async (req, ws, scope) => {
  // return false
});
```

# Middlewares

## Global middlewares

Global middlewares are effective all over the http request process.

They can be added by `aex.use` function.

```ts
aex.use(async (req, res, scope) => {
  // process 1
  // return false
});

aex.use(async (req, res, scope) => {
  // process 2
  // return false
});

// ...

aex.use(async (req, res, scope) => {
  // process N
  // return false
});
```

> Return `false` in middlewares will cancel the whole http request processing  
> It normally happens after a `res.end`

## Handler specific middlewares

Handler specific middlewares are effective only to the specific handler.

They can be optionally added to the handler option via the optional attribute `middlewares`.

the `middlewares` attribute is an array of async functions of `IAsyncMiddleware`.

so we can simply define handler specific middlewares as follows:

```ts
router.get(
  "/",
  async (req, res, scope) => {
    res.end("Hello world!");
  },
  [
    async (req, res, scope) => {
      // process 1
      // return false
    },
    async (req, res, scope) => {
      // process 2
      // return false
    },
    // ...,
    async (req, res, scope) => {
      // process N
      // return false
    },
  ]
);
```

## Websocket middlewares

Websocket middlewares are of the same to the above middlewares except that the parameters are of different.

```ts
type IWebSocketAsyncMiddleware = (
  req: Request,
  socket: WebSocket,
  scope?: Scope
) => Promise<boolean | undefined | null | void>;
```

The Websocket Middlewares are defined as `IWebSocketAsyncMiddleware`, they pass three parameters:

1. the http request
2. the websocket object
3. the scope object

THe middlewares can stop websocket from further execution by return `false`

# Accessable members

## server

The node system `http.Server`.

Accessable through `aex.server`.

```ts
const aex = new Aex();
const server = await aex.start();
expect(server === aex.server).toBeTruthy();
server.close();
```

# Scope

Aex provides scoped data for global and local usage.

A scope object is passed by middlewares and handlers right after `req`, `res` as the third parameter.

It is defined in `IAsyncMiddleware` as the following:

```ts
async (req, res, scope) => {
  // process N
  // return false
};
```

the `scope` variable has 8 native attributes: `time`, `outer`, `inner`, `query`, `params`, `body`, `error`, `debug`

The `time` attribute contains the started time and passed time of requests.
The `outer` attribute is to store general or global data.
The `inner` attribute is to store specific or local data.
The `query` attribute is to store http query.
The `body` attribute is to store http body.
The `params` attribute is to store http params.
The `error` attribute is to store scoped errors.
The `debug` attribute is to provide handlers the debugging ability.

## `time`

### Get the requesting time

```ts
scope.time.started;
// 2019-12-12T09:01:49.543Z
```

### Get the passed time

```ts
scope.time.passed;
// 2019-12-12T09:01:49.543Z
```

## `outer` and `inner`

The `outer` and `inner`variables are objects used to store data for different purposes.

You can simply assign them a new attribute with data;

```ts
scope.inner.a = 100;
scope.outer.a = 120;
```

## `debug`

`debug` is provided for debugging purposes.

It is a simple import of the package `debug`.

Its usage is of the same to the package `debug`, go [debug](https://github.com/visionmedia/debug) for detailed info.

Here is a simple example.

```ts
async (req, res, scope) => {
  const { debug } = scope;
  const logger = debug("aex:scope");
  logger("this is a debugging info");
};
```

## all these build-in attribute are readonly

```ts
// scope.outer = {};  // Wrong operation!
// scope.inner = {};   // Wrong operation!
// scope.time = {};    // Wrong operation!
// scope.query = {};    // Wrong operation!
// scope.params = {};    // Wrong operation!
// scope.body = {};    // Wrong operation!
// scope.error = {};    // Wrong operation!
// scope.debug = {};    // Wrong operation!
// scope.time.started = {};  // Wrong operation!
// scope.time.passed = {};   // Wrong operation!
```

# Use middlewares from expressjs

Aex provide a way for express middlewares to be translated into Aex middlewares.

You need just a simple call to `toAsyncMiddleware` to generate Aex's async middleware.

```ts
const oldMiddleware = (_req: any, _res: any, next: any) => {
  // ...
  next();
};

const pOld = toAsyncMiddleware(oldMiddleware);
aex.use(pOld);
```

> You should be cautious to use express middlewares.
> Full testing is appreciated.

# Tests

```
npm install
npm test
```

# Lincense

MIT

[downloads-image]: http://img.shields.io/npm/dt/@aex/core.svg
[downloads-image-month]: http://img.shields.io/npm/dm/@aex/core.svg
[npm-image]: https://img.shields.io/npm/v/@aex/core.svg
[npm-url]: https://npmjs.org/package/@aex/core
[daviddm-image]: https://david-dm.org/calidion/@aex/core.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/@aex/core
