# Buffer an async iterator with both buffer count and timespan

## Installation

```
npm i buffer-time-count-generator
```

## Usage

```js
const bufferTimeOrCount = require("buffer-time-count-generator");

// example source generator
// this will generate 0, 1, 2, etc. after each timespan defined in arguments list
// example: every(100, 200, 50, 10, 100) will generator `0` after 100ms, then `1` after 200ms and so on.
async function* every(...times) {
  let i = 0;
  while (i < times.length) {
    await sleep(times[i]);
    yield i++;
  }
}

// buffer
const output = [];
for await (const buffer of bufferTimeOrCount(
  every(100, 50, 100, 10, 10, 10, 250, 500, 10),
  200, // wait no longer than 200ms
  3,   // buffer size is no larger than 3
)) {
  console.log(buffer);

  // this will log
  // after about 200ms: [0, 1]
  // after about 70ms:  [2, 3, 4]
  // after about 130ms: [5]
  // after about 200ms: [6]
  // after about 200ms: []
  // after about 200ms: []
  // after about 200ms: [7, 8]
}

// ------------[START]------>[200ms]--->[count=3]-->[200ms]-->[200ms]-->[200ms]-->[END]
expect(output).toEqual([[0, 1], [2, 3, 4], [5],     [6],      [],       [],       [7, 8]]);
```
