const subject = require("@async-generator/subject");

module.exports = async function* merge(...iters) {
  const [iterator, feed] = subject();
  let remaining = iters.length;

  iters.forEach(async it => {
    for await (let item of it) {
      feed(item);
    }
    remaining--;
  });

  for await (const merged of iterator) {
    yield merged;

    if (!remaining) {
      break;
    }
  }
};
