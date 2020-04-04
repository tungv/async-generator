# returns an <AsyncIterator> that iterates eventName events emitted by the emitter

This is an ponyfill for NodeJS's [`EventEmitter.on`](https://nodejs.org/api/events.html#events_events_on_emitter_eventname)

## installation

```
> npm i @async-generator/emitter-on
```

## usage

```js
const on = require("@async-generator/on");

const emitter = new EventEmitter();

for await (const item of on(emitter, "data")) {
  console.log(item); // will log { id: 1 }, { id: 2 } etc.
}

// somewhere else in your code
emitter.emit("data", { id: 1 });
emitter.emit("data", { id: 2 });
emitter.emit("data", { id: 3 });
emitter.emit("data", { id: 4 });
```
