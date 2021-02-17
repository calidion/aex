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

Decorators will be enriched over time. Currently aex provides the following decorators:

1. [HTTP method decorators](./docs/decorators.md#1-http-method-decorators) (`@http`,  `@get`,  `@post`)

2. [Data parsing decorators](./docs/decorators.md#2-data-parsing-decorators) (`@formdata`,  `@query`,  `@body`)
3. [Static file serving decorators](./docs/decorators.md#3-static-file-serving-decorators) (`@serve`)
4. [Session management decorators](./docs/decorators.md#4-session-management-decorators) (`@session`)
5. [Data filtering and validation decorators](./docs/decorators.md#5-data-filtering-and-validation-decorators) ( `@filter`)
6. [Error definition decorators](./docs/decorators.md#6-error-definition-decorators) (`@error`)
7. [Custome middleware decorators](./docs/decorators.md#7-custome-middleware-decorators) (`@inject`)

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


# No semver
Semver has been ruined node.js npm for a long time, aex will not follow it. Aex will warn every user to keep aex version fixed and take care whenever update to anew version. 
Aex follows a general versioning called [Effective Versioning](https://github.com/calidion/effective-versioning).


# No callbacks in middleware
aex is anti-koa which is wrong and misleading just like semver.

# All lives matter
aex is an anti BLM project and a protector of law and order.

# Lincense

MIT

[downloads-image]: http://img.shields.io/npm/dt/@aex/core.svg
[downloads-image-month]: http://img.shields.io/npm/dm/@aex/core.svg
[npm-image]: https://img.shields.io/npm/v/@aex/core.svg
[npm-url]: https://npmjs.org/package/@aex/core
[daviddm-image]: https://david-dm.org/calidion/aex.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/aex
