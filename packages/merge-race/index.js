const subject = require("@async-generator/subject");

module.exports = async function* merge(...iters) {
  const [iterator, feed] = subject();
  let ended = false;

  iters.forEach(async it => {
    for await (let item of it) {
      feed(item);
    }
    ended = true;
  });

  for await (const merged of iterator) {
    yield merged;

    if (ended) {
      break;
    }
  }
};
