# Generate integers every preset amount of time

## Installation

```
> npm i @async-generator/inteval
```

## Usage

```js
const interval = require("@async-generator/inteval");

const everySecond = interval(1000);

for await (let i of everySecond) {
  console.log(i) // will log 0, 1, 2, 3, ... every second
}

// usage with optional mapFn
const booleanEverySecond = interval(1000, n => n % 2 === 0);

for await (let isEven of everySecond) {
  console.log(isEven) // will log true, false, true, false, ... every second
}

```
