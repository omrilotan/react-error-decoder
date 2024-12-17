# CHANGELOG

## 2.1.1

- Add 542, 543

## 2.1.0

- Use native URL class available in the environment instead of importing from `node:url` module

## 2.0.10

- Add 541
- Rephrase some error messages

## 2.0.9

- Add 530-540

## 2.0.8

- Add: 530
- Update error messages

## 2.0.7

- Add: 510-529
- Update existing error messages

## 2.0.6

- Add: 501-509
- Update lots of already existing error messages (phrasing, typos, links, etc.)

## 2.0.5

- Update list source
- Add: 477-500

## 2.0.4

- Add: 476

## 2.0.3

- Update: 375, 444
- Add: 466-475

## 2.0.2

- Add: 461-465
- One phrasing update (440)

## 2.0.1

- Add: 456-460
- Some phrasing updates

## 2.0.0

### Breaking change

- Use named imports instead of default (`import { decode } from 'react-error-decoder'`)
- Introduce ESM and CJS builds

#### Migration

CommonJS

```diff
- const decode = require('react-error-decoder');
+ const { decode } = require('react-error-decoder');
```

ESM

```diff
- import decode from 'react-error-decoder';
+ import { decode } from 'react-error-decoder';
```

## 1.1.5 2022-10-17

### Update error dictionary

- Add: 441-455

## 1.1.4 2022-09-19

### Update error dictionary

- Add: 436-440

## 1.1.3 2022-07-27

### Update error dictionary

- Add: 434, 435

## 1.1.2 2022-06-07

### Update error dictionary

- Add: 432, 433

## 1.1.1 2022-03-17

### Update error dictionary

- Modify: 355, 418
- Add: 419-431

## 1.1.0 2022-01-10

### Add ability to get error details: url and invariant number

```js
decode.details(...)
```

### Update error dictionary

- Add: 418

## 1.0.0 2021-10-12

### Update error dictionary

- Remove: 291, 296
- Update: 350, 365
- Add: 385-417

## 0.1.0 2021-01-18

### Decode React minified error message
