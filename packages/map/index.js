module.exports = async function* map(iter, mapFn) {
  let index = 0;
  for await (const item of iter) {
    yield mapFn(item, index++);
  }
};
