const identity = x => x;

module.exports = async function* interval(ms, map = identity) {
  let i = 0;
  while (true) {
    await sleep(ms);
    yield map(i++);
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
