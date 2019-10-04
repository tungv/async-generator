const subject = require("@async-generator/subject");

const identity = x => x;

module.exports = function intervalWithReset(ms, mapFn = identity) {
  const [iter, feed] = subject();
  let counter = 0;

  let timer;

  setTimer();

  async function* generate() {
    for await (const i of iter) {
      yield mapFn(i);
    }
  }

  function setTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      feed(counter++);
      setTimer();
    }, ms);
  }
  return [generate(), setTimer];
};
