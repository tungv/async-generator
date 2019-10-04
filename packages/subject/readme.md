# create an async iterator with a method to feed values into and end it

This is one of the most powerful functions, use it sparely.

## installation

```
> npm i @async-generator/subject
```

## usage

```js
const subject = require("@async-generator/subject");

const [iterator, feed, end] = subject();

sleep(100).then(async () => {
  feed(1);
  await sleep(100);
  feed(2);

  await sleep(100);
  feed(3);

  await sleep(100);
  feed(4);

  end();
});

for await (const item of iterator) {
  console.log(item); // will log 1, 2, 3, 4 and end loop afterward
}

```
