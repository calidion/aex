import { IncomingMessage, ServerResponse } from "http";
import { Scope } from "../scope";
import { IAsyncMiddleware } from "../types";

export function parseStringToNumber(id: string, value: number = 1) {
  const parsed = parseInt(id);
  if (isNaN(parsed)) {
    return value;
  }
  return parsed;
}

export function paginate(
  limitFallback = 20,
  type: "query" | "params" | "body" = "query"
): IAsyncMiddleware {
  return async function (
    _req: IncomingMessage,
    _res: ServerResponse,
    scope?: Scope
  ) {
    const data = (scope as any)[type];
    const limit = parseStringToNumber(data.limit, limitFallback);
    const page = parseStringToNumber(data.page);
    const offset = (page - 1) * limit;

    const pagination = {
      limit,
      page,
      offset,
    };

    (scope as any).pagination = pagination;
  };
}
