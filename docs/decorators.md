# Decorators

Aex is simplified by decorators, so you should be familiar with decorators to full utilize aex.

Decorators will be enriched over time. Currently aex provides the following decorators:

1. HTTP method decorators: `@http`, `@get`, `@post`
2. Data parsing decorators: `@formdata`, `@query`, `@body`
3. Static file serving decorators: `@serve`
4. Session management decorators: `@session`
5. Data filtering and validation decorators: `@filter`
6. Error definition decorators: `@error`
7. Custome middleware decorators: `@inject`

## 1. HTTP method decorators

This decorators are the most basic decorators, all decorators should follow them. They are
`@http` , `@get` , `@post` .


### `@http`,`@get`, `@post`

`@http` is the generic http method decorator. `@get` , `@post` are the shortcuts for `@http` ; 

The `@http` decorator defines your http handler with a member function.

The member methods are of `IAsyncMiddleware` type.

`@http` takes two parameter:

1. http method name(s)
2. url(s);

You can just pass url(s) if you use http `GET` method only or you can use `@get` .

Here is how your define your handlers.

``` ts
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

## 2. Data parsing decorators

These decorators will parse all data passed thought the HTTP protocol.
They are `@formdata` , `@query` , `@body` .

1. `@formdata` can parse `mulit-part` formdata such as files into `scope.files` and other formdata into `scope.body`. When parsed, you can retrieve your `multi-part` formdata from `scope.files`,  `scope.body`.
2. `@query` can parse url query into `scope.query`.
3. `@body` can parse some simple formdata into `scope.body`.

### `@formdata`

Decorator `@formdata` is a simplified version of node package [ `busboy` ](https://github.com/mscdex/busboy) for `aex` , only the `headers` options will be auto replaced by `aex` . So you can parse valid options when necesary.
All uploaded files are in array format, and it parses body as well.

``` ts
import { http, formdata } from "@aex/core";

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

### `@body`

Decorator @body provides a simple way to process data with body parser. It a is a simplified version of node package [body-parser](https://github.com/expressjs/body-parser).

It takes two parameters:

1. types in ["urlencoded", "raw", "text", "json"]
2. options the same as body-parser take.

then be parsed into `scope.body` , for compatibility `req.body` is still available.

Simply put:

``` ts
@body("urlencoded", { extended: false })
```

Full example

``` ts
import { http, body } from "@aex/core";

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

### `@query`

Decorator @query will parse query for you. After decorated with `@query` you will have `scope.query` to use. `req.query` is available for compatible reasion, but it is discouraged.

``` ts
class Query {
  @http("get", "/profile/:id")
  @query()
  public async id(req: any, res: any, _scope: any) {
    // get /profile/111?page=20
    req.query.page;
    // 20
  }
}
```

## 3. Static file serving decorators

Aex provides `@serve` decorator for static file serving.

### `@serve`

Decorator `@serve` provides a simple way to serve static files. It a is a simplified version of node package [serve-staticserve-static](https://github.com/expressjs/serve-static).

It takes two parameters:

1. url: the base url for your served files.
2. options: exact options package `serve-static` takes.

then inside the member function you should return the absolute path of of the root of the static files.

``` ts
import { serve } from "@aex/core";

class StaticFileServer {
  protected name = "formdata";

  @serve("/assets")
  public async upload() {
    return resolve(__dirname, "./fixtures");
  }
}
```

## 4. Session management decorators

Aex provides `@session` decorator for default cookie based session management.
Session in other format can be realized with decorator `@inject` .

### `@session`

Decorator `@session` takes a store as the parameter. It is an object derived from the abstract class ISessionStore. which is defined like this:

``` ts
export declare abstract class ISessionStore {
    abstract set(id: string, value: any): any;
    abstract get(id: string): any;
    abstract destroy(id: string): any;
}
```

`aex` provides two default store: `MemoryStore` and `RedisStore` .
`RedisStore` can be configurated by passing options through its constructor. The passed options is of the same to the function `createClient` of the package `redis` . You can check the option details [here](https://github.com/NodeRedis/node-redis#options-object-properties)

For `MemoryStore` , you can simply decorate with `@session()` .
For `RedisStore` , you can decorate with an RedisStore as `@session(redisStore)` . Be sure to keep the variable redisStore global, because sessions must share only one store.

``` ts
// Must not be used @session(new RedisStore(options)).
// For sessions share only one store over every request.
// There must be only one object of the store.
const store = new RedisStore(options); 
class Session {
  @post("/user/login")
  @session()
  public async get(req, res, scope) {
    const {session} = scope;
    session.user = user;
  }

  @get("/user/profile")
  @session()
  public async get(req, res, scope) {
    const {session} = scope;
    const user = session.user;
    res.end(JSON.stringify(user));
  }

  @get("/user/redis")
  @session(store)
  public async get(req, res, scope) {
    const {session} = scope;
    const user = session.user;
    res.end(JSON.stringify(user));
  }
}
```

> Share only one store object over requests.

## 5. Data filtering and validation decorators

Aex provides `@filter` to filter and validate data for you.

### `@filter`

Decorator `@filter` will filter `body`, `params` and `query` data for you, and provide fallbacks respectively for each invalid data processing.

Reference [node-form-validator](https://github.com/calidion/node-form-validator) for detailed usage.

```ts
class User {
  private name = "Aex";
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
      body: async(error, req, res, scope) {
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
    },
    fallbacks: {
      params: async function (this: any, _error: any, _req: any, res: any) {
        this.name = "Alice";
        res.end("Params failed!");
      },
    }
  })
  public async id(req: any, res: any, _scope: any) {
    // req.params.id
    // req.query.page
  }
}
```

## 6. Error definition decorators

Aex provides `@error` decorator for error definition

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

## 7. Custome middleware decorators

Aex provides `@inject` decorator for middleware injection.

`@inject` decrator takes two parameters:

1. injector: the main injected middleware for data further processing or policy checking
2. fallback: optional fallback when the injector fails and returned `false`

```ts
class User {
  private name = "Aex";
  @http("post", "/user/login")
  @body()
  @inject(async (req, res, scope) => {
      req.session = {
        user: {
          name: "ok"
        }
      };
  })
  @inject(async function(this:User, req, res, scope) {
      this.name = "Peter";
      req.session = {
        user: {
          name: "ok"
        }
      };
  })
  @inject(async function(this:User, req, res, scope) => {
      this.name = "Peter";
      if (...) {
        return false
      }
  }, async function fallback(this:User, req, res, scope){
    // some fallback processing
    res.end("Fallback");
  })
  public async login(req: any, res: any, scope: any) {
    // req.session.user.name
    // ok
    ...
  }
}
```
