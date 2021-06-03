import { IncomingMessage, ServerResponse } from "http";
import { Scope } from "../scope";
import { IAsyncMiddleware } from "../types";

export function parseStringToNumber(id: string, value: number = 1) {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    return value;
  }
  return parsed;
}

export function paginate(
  limitFallback = 20,
  type: "query" | "params" | "body" = "query"
): IAsyncMiddleware {
  return async function paging(
    // tslint:disable-next-line: variable-name
    _req: IncomingMessage,
    // tslint:disable-next-line: variable-name
    _res: ServerResponse,
    scope?: Scope
  ) {
    const data = (scope as any)[type];
    const limit = parseStringToNumber(data.limit, limitFallback);
    const page = parseStringToNumber(data.page);
    const offset = (page - 1) * limit;

    const pagination = {
      limit,
      offset,
      page,
    };

    (scope as any).pagination = pagination;
  };
}
