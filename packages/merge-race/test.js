const mergeRace = require(".");
const interval = require("@async-generator/interval");
const take = require("@async-generator/take");

it("should merge 2 or more generators", async () => {
  const input30 = interval(300, i => `[300ms]: ${i + 1}`);
  const input50 = interval(500, i => `[500ms]: ${i + 1}`);
  const input70 = interval(700, i => `[700ms]: ${i + 1}`);

  const merged = mergeRace(input30, input50, input70);
  const actual = await exhaust(take(merged, 8));

  expect(actual).toEqual([
    `[300ms]: 1`,
    `[500ms]: 1`,
    `[300ms]: 2`,
    `[700ms]: 1`,
    `[300ms]: 3`,
    `[500ms]: 2`,
    `[300ms]: 4`,
    `[700ms]: 2`,
  ]);
});

it("should end when first input ends", async () => {
  const input30 = interval(300, i => {
    // this must stop after the 4th iteration
    expect(i).toBeLessThan(4);
    return `[300ms]: ${i + 1}`;
  });
  const input50 = interval(500, i => `[500ms]: ${i + 1}`);
  const input70 = interval(700, i => `[700ms]: ${i + 1}`);

  const merged = mergeRace(
    take(input30, 4),
    take(input50, 2),
    take(input70, 2)
  );
  const actual = await exhaust(merged);
  expect(actual).toEqual([
    `[300ms]: 1`,
    `[500ms]: 1`,
    `[300ms]: 2`,
    `[700ms]: 1`,
    `[300ms]: 3`,
    `[500ms]: 2`,
  ]);
});

async function exhaust(iter) {
  const collected = [];
  for await (let i of iter) {
    collected.push(i);
  }

  return collected;
}
