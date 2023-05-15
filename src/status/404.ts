/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { IResponse } from "../types";

// tslint:disable-next-line:variable-name
export function NotFound(res: IResponse) {
  res.statusCode = 404;

  const html = `
<html>
<body>
<h1>Not Found!</h1>
</body>
</html>
`;
  res.write(html);
  res.end();
}

export default NotFound;
