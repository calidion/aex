import * as qs from "querystring";
import { Scope } from "../scope";
import { IRequest } from "../types";
export function parseQuery(req: IRequest, scope: Scope) {
  const splited = req.url.split("?");
  if (splited.length > 1) {
    const query = qs.parse(splited[1]);
    req.query = query;
  }
  Object.assign(scope.query, req.query);
}
