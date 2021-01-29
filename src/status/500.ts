/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { ServerResponse } from "http";

// tslint:disable-next-line:variable-name
export async function InternalServerError(res: ServerResponse) {
  res.statusCode = 500;

  const html = `
<html>
<body>
<h1>Internal Server Error!</h1>
</body>
</html>
`;
  res.write(html);
  res.end();
}

export default InternalServerError;
