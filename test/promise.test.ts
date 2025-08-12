import { expect, test } from "@jest/globals";
import { withDelay, withTimeout } from "../src/module/promise";

test("Should wait 3 seconds and resolves", async () => {
  expect(
    await withDelay({
      callback: () => Promise.resolve(console.log("abc")),
      ms: 3_000,
    })
  ).toBeUndefined();
});

test("Should wait 3 seconds and rejects", async () => {
  await expect(
    withTimeout({
      callback: async () =>
        await new Promise((_, reject) => {
          setTimeout(() => {
            reject();
          }, 4_000);
        }),
      ms: 3_000,
    })
  ).rejects.toThrow();
});
