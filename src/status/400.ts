/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { ServerResponse } from "http";

// tslint:disable-next-line:variable-name
export async function BadRequest(res: ServerResponse) {
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
