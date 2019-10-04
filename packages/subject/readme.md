# take outputs from one generator and transform them

It's like `Array#map` but for `AsyncGenerator`

## installation

```
> npm i @async-generator/map
```

## usage

```js
const map = require("@async-generator/map");
const interval = require("@async-generator/interval");

const input = interval(100);
const output = map(input, x => x * x);

const actual = [];

for await (const item of output) {
  console.log(item); // will log 0, 1, 4, 9, 16, 25, ...
}
```
