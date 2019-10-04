# Merge multiple async generator and terminate upon the first termination

It's like `Promise#race` but for `AsyncGenerator`

## Installation

```
> npm i @async-generator/merge-race
```

## Usage

```js
const mergeRace = require("@async-generator/merge-race")
const interval = require("@async-generator/interval")


async function* generateInput1() {
  yield 1;
  yield 2;
}
async function* generateInput2() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const merged = mergeRace(generateInput1(), generateInput2());
for await (const item of merged) {
  console.log(item) // will log 1, a, 2, b and end the loop
}
```
