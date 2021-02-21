# Helpers

Helpers are special middlewares with parameters to ease some fixed pattern with web development.

They must work with decorator `@inject`.

The first aviable helper is `paginate`.

## paginate

Helper `paginate` can help with your pagination data parsing and filtering. It gets the correct value for you, so you can save your code parsing and correcting the pagination data before using them.

### paramters

`paginate` is function takes two parameter:

1. `limit` is the default value of limitation for pagination, if the request is not specified. This function defaults it to `20`, so you your request doesn't specific a value to `limit`, it will be assigned `20`.

2. `type` is the type data you use for pagination, it can be `body`, `params`, `query`. `query` is the default one. Before use `paginate`, you must parsed your data. For if you use `body` for pagination, normally your reuqest handlers should be deocrated with `@body`. Becuase params are parsed internally, using params needs no docrator.
   The data to be parsed must contain two parameters which should be named with : `page`, `limit`.
   for type `query`, pagination data can be : `list?page=2&limit=30`;

### use

after parsing, `scope` will be added a attribute `pagination`, which is a object have three attribute: `page`, `limit`, `offset`. so you can simply extract them with

```ts
const {
  pagination: { page, limit, offset },
} = scope;
```

Here is how to use helper `paginate`.

```ts
class Paginator {
  @http('/page/query')
  @query()
  @inject(paginate(10, 'query'))
  async public pageWithQuery(req, res, scope) {
    const {pagination: {page, limit, offset}} = scope;

    ...
  }

  @http('/page/body')
  @body()
  @inject(paginate(10, 'body'))
  async public pageWithBody(req, res, scope) {
    const {pagination: {page, limit, offset}} = scope;

    ...
  }

  @http('/page/params/:page/:limit')
  @body()
  @inject(paginate(10, 'body'))
  async public pageWithParams(req, res, scope) {
    const {pagination: {page, limit, offset}} = scope;

    ...
  }
}
```
