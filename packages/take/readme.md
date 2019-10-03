# stop an async generator after a fixed number of iterations

## installation

```
> npm i @async-generator/take
```

## usage

```js
const take = require("@async-generator/take");
const interval = require("@async-generator/interval");

const input = interval(100);
const output = take(input, 5);

const actual = [];

for await (const i of output) {
  actual.push(i);
}

expect(actual).toEqual([0, 1, 2, 3, 4]);
```
