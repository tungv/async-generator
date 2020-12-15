# Ensure concurrency for async works

## Installation

```
npm i @async-generator/concurrent
```

## Usage

```js
const concurrent = require("@async-generator/concurrent");

// example source generator
const input = fromArray([101, 52, 103, 14, 15, 16, 257, 508, 19]);

async function work(ms) {
  await sleep(ms);
  return ms;
}

const output = [];
for await (const i of concurrent(input, 2, work)) {
  output.push(i);
}

expect(output).toEqual([52, 101, 14, 15, 16, 103, 257, 19, 508])

// TIMELINE
// 0ms       52ms   101ms    115ms     130ms   146ms              403ms    422ms   663ms
// | <-- 101 -|----> | <-14-> | <-15-> | <-16-> | <-- 257 -------> | <-19-> X       |
// | <--52--> | <-- 103 ------|--------|--------|-> | <-- 508 -----|--------|-----> X
//                                                155ms
```
