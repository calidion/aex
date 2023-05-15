import { IAsyncMiddleware, IHTTPHeaders, IRequest, IResponse } from "../types";

export function getAllowOrigin(origin: string, headers: IHTTPHeaders) {
  if (origin === "*") {
    if (!headers.refer) {
      return headers.origin ? headers.origin : origin;
    } else {
      return typeof headers.refer === "string"
        ? headers.refer
        : headers.refer[0];
    }
  }
  return origin;
}

export function cors(
  origin: string = "*",
  methods = "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  headers = "X-Requested-With,content-type",
  credentials = "true"
): IAsyncMiddleware {
  return async function corsHelper(req: IRequest, res: IResponse) {
    const ao = getAllowOrigin(origin, req.headers);

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", ao);

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", methods);

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", headers);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", credentials);
  };
}
