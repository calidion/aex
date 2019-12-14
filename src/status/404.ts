import { IncomingMessage, ServerResponse } from 'http';

// tslint:disable-next-line:variable-name
export async function NotFound(_req: IncomingMessage, res: ServerResponse) {
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
