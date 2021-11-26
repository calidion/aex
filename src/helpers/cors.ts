import { IncomingMessage, ServerResponse } from "http";
import { IAsyncMiddleware } from "../types";

export function cors(
  origin: string = "*",
  methods = "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  headers = "X-Requested-With,content-type",
  credentials = "true"
): IAsyncMiddleware {
  return async function corsHelper(req: IncomingMessage, res: ServerResponse) {
    let ao = origin;
    if (origin === "*") {
      if (!req.headers.refer) {
        ao = req.headers.origin ? req.headers.origin : origin;
      } else {
        ao =
          typeof req.headers.refer === "string"
            ? req.headers.refer
            : req.headers.refer[0];
      }
    }

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
