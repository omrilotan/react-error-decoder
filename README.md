# react-error-decoder [![](https://img.shields.io/npm/v/react-error-decoder.svg)](https://www.npmjs.com/package/react-error-decoder)

## ⚛︎ Decode react minified error message

In the minified production build of React, they avoid sending down full error messages. Instead, we can use the error code to view the full message for full errors and additional helpful warnings.

This small tool is meant to mitigate this gap.

```js
const decode = require('react-error-decoder');

decode('Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.')

// Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.
```
