/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { IResponse } from "../types";

// tslint:disable-next-line:variable-name
export function BadRequest(res: IResponse) {
  res.statusCode = 400;

  const html = `
<html>
<body>
<h1>Bad Request!</h1>
</body>
</html>
`;
  res.write(html);
  res.end();
}

export default BadRequest;
