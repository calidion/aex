[![Build Status](https://travis-ci.com/calidion/aex.svg?branch=master)](https://travis-ci.com/calidion/aex)
[![Coverage Status](https://coveralls.io/repos/github/calidion/aex/badge.svg?branch=master)](https://coveralls.io/github/calidion/aex?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# AEX

A simple, easy to use, scoped web server, with async linear middlewares and no callbacks.

It is an example:

1. To show that callbacks are not needed with promise/async/await.
2. To use middlewares in a linear way instead of stacked way which is insecure.
   > For the stacked middleware model will carry response back to the top most so called middleware pushed, where every middleware can access to the body returned.
3. To pass some vairiables through middlewares and to the final handler.

# A simple example

```ts
import { Aex, Router } from "@aex/core";

const aex = new Aex();
const router = new Router(aex);

// Simple string route
router.get("/", async (req, res, scope) => {
  // request processing time started
  console.log(scope.time.stated);
  // processing time passed
  console.log(scope.time.passed);
  res.end("Hello Aex!");
});

// Route Array
router.get(["/user/home", "/user/profile"], async (req, res, scope) => {
  // request processing time started
  console.log(scope.time.stated);
  // processing time passed
  console.log(scope.time.passed);
  res.end("Hello Aex!");
});

aex.use(router.toMiddleware());

const port = 3000;
const host = "localhost";
aex.start(port, host).then();
```

# Install

```sh
npm i @aex/core
```

or

```sh
yarn add @aex/core
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
ws.on(WebSocketServer.ENTER, handler => {
  // process/here
});
```

3. Listen on user-customized events

```ts
ws.on(WebSocketServer.ENTER, handler => {
  handler.on("event-name", data => {
    // data.message = "Hello world!"
  });
});
```

4. Send message to browser / client

```ts
ws.on(WebSocketServer.ENTER, handler => {
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
        message: "Hello world!"
      }
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
    }
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

the `scope` variable has three native attributes: `time`, `outer`, `inner`.

The `time` attribute contains the started time and passed time of requests.
The `outer` attribute is to store general or global data.
The `inner` attribute is to store specific or local data.

## `time`

1. Get the requesting time

```ts
scope.time.started;
// 2019-12-12T09:01:49.543Z
```

2.  Get the passed time

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

## all these build-in attribute are readonly

```ts
// scope.outer = {};  // Wrong operation!
// scope.inner = {};   // Wrong operation!
// scope.time = {};    // Wrong operation!
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

# Decorators

1. @http
2. @body

## @http

Aex provides the `@http` decorator to ease the way http requests being handled by classes. It is very simple and intuitive.

### Define a class with it's methods decorated by `@http`

The member methods are of `IAsyncMiddleware` type as well.

```ts
import { http } from "@aex/core";

class User {
  @http("get", ["/profile", "/home"])
  profile(req, res, scope) {}

  @http(["get", "post"], "/user/login")
  login(req, res, scope) {}

  @http("post", "/user/logout")
  logout(req, res, scope) {}
}
```

### Get router from One

```ts
import { One } from "@aex/core";
const router = One.instance();
```

### New the class (optional)

You normally need to create an instance of you class for data accessing.

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
