# react-error-decoder [![](https://img.shields.io/npm/v/react-error-decoder.svg)](https://www.npmjs.com/package/react-error-decoder)

## ⚛︎ Decode react minified error message

In the minified production build of React, they avoid sending down full error messages. Instead, we can use the error code to view the full message for full errors and additional helpful warnings.

This small tool is meant to mitigate this gap.

```js
import { decode } from "react-error-decoder";

decode(
  "Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
);

// Output:
("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.");
```

Safe for any error message

```js
decode("Something must have gone horribly wrong");

// Output:
("Something must have gone horribly wrong");
```

Get some more details

```js
decode.details('Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.')

// Output:
{
  message: 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.',
  invariant: '130',
  url: 'https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]='
}

// non react object
{
  message: 'Something must have gone horribly wrong',
  invariant: undefined,
  url: undefined
}
```

> Uses [source list from React repo](https://github.com/facebook/react/blob/main/scripts/error-codes/codes.json)

## The Centralized Logging Middleware use case

```mermaid
flowchart LR
  A[Frontend App] -->|POST error payload| B[Log Server Middleware]
  B -->|Decode, Enrich| F[(Database or Third-Party Logger)]
```

When your frontend catches an error and POSTs it to &log-server, you can intercept it on &log-server and decode it before it hits your database or third-party logger.

```ts
import { decode } from "react-error-decoder";
const {
  message,
  ...rest
} = request.body.errors.at(0) as {
  message: string;
  [key: string]: unknown;
};
const logRecord = {
  // Magically decode the minified React error message
  message: decode(message),
  // Keep the rest of the error payload as is
  ...rest,
  // enrich with whatever you want
  userAgent: request.headers["user-agent"],
  uid: request.cookies["uid"],
  …
};
```

Go one step further and add details that can be used for analytics

```ts
const {
  message,
  invariant: reactErrorId
} = decode.details(message);
const logRecord = {
  message,
  reactErrorId, // "130"
  …
};
```
