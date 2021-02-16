# Decorators

Aex is simplified by decorators, so you should be familiar with decorators to full utilize aex.

Decorators will be enriched over time. Currently aex provides the following decorators:

## 1. HTTP method decorators

This decorators are the most basic decorators, all decorators should follow them. They are
`@http`, `@get`, `@post`.

`@http` is the generic http method decorator. `@get`, `@post` are the shortcuts for `@http`;

The `@http` decorator defines your http handler with a member function.

The member methods are of `IAsyncMiddleware` type.

`@http` takes two parameter:

1. http method name(s)
2. url(s);

You can just pass url(s) if you use http `GET` method only or you can use `@get`.

Here is how your define your handlers.

```ts
import { http, get, post } from "@aex/core";

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

  @get(["/user/get", "/user/gets"])
  rawget(req, res, scope) {}

  @post("/user/post")
  rawpost(req, res, scope) {}
}
```

## 2. Request parsing decorators

These decorators will parse all data passed thought the HTTP protocol.
They are `@formdata`, `@query`, `@body`.

1. `@formdata` can parse `mulit-part` formdata such as files into `scope.files` and other formdata into `scope.body`. When parsed, you can retrieve your `multi-part` formdata from `scope.files`, `scope.body`.
2. `@query` can parse url query into `scope.query`.
3. `@body` can parse some simple formdata into `scope.body`.

### Usage

#### `@formdata`

Decorator `@formdata` is a simplified version of node package [`busboy`](https://github.com/mscdex/busboy) for `aex`, only the `headers` options will be auto replaced by `aex`. So you can parse valid options when necesary.
All uploaded files are in array format, and it parses body as well.

```ts
class Formdata {
  protected name = "formdata";

  @http("post", "/file/upload")
  @formdata()
  public async upload(_req: any, res: any, scope: any) {
    const { files, body } = scope;

    // Access your files
    const uploadedSingleFile = files["fieldname1"][0];
    const uploadedFileArray = files["fieldname2"];

    // Access your file info

    uploadedSingleFile.temp; // temporary file saved
    uploadedSingleFile.filename; // original filename
    uploadedSingleFile.encoding; // file encoding
    uploadedSingleFile.mimetype; // mimetype

    // Access none file form data
    const value = body["fieldname3"];
    res.end("File Uploaded!");
  }
}
```

#### `@body`

Decorator @body provides a simple way to process data with body parser. It a is a simplified version of node package [body-parser](https://github.com/expressjs/body-parser).

It takes two parameters:

1. types in ["urlencoded", "raw", "text", "json"]
2. options the same as body-parser take.

then be parsed into `scope.body`, for compatibility `req.body` is still available.

Simply put:

```ts
@body("urlencoded", { extended: false })
```

Full example

```ts
import { http } from "@aex/core";

class User {
  @http("post", "/user/login")
  @body("urlencoded", { extended: false })
  login(req, res, scope) {
    const { body } = scope;
  }

  @http("post", "/user/logout")
  @body()
  login(req, res, scope) {
    const { body } = scope;
  }
}
```

#### `@query`

Decorator @query will parse query for you. After decorated with `@query` you will have `scope.query` to use. `req.query` is available for compatible reasion, but it is discouraged.

```ts
  @http("get", "/profile/:id")
  @query()
  public async id(req: any, res: any, _scope: any) {
    // get /profile/111?page=20
    req.query.page
    // 20
  }
```
