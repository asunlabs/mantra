import { expect, test } from '@jest/globals';
import { withDelay, withSafeSequence, withTimeout } from '../src/module/promise';
import { unstable_AsyncQueue } from '../src/module/queue';

test('Should wait 3 seconds and resolves', async () => {
  expect(
    await withDelay({
      callback: () => Promise.resolve(console.log('abc')),
      ms: 3_000,
    })
  ).toBeUndefined();
});

test('Should wait 3 seconds and rejects', async () => {
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

test('Should return proper values', async () => {
  const promises = [
    Promise.resolve(0),
    Promise.resolve(1),
    Promise.reject('2 error')
      .then()
      .catch((e) => {
        throw e;
      }),
    Promise.resolve(3),
    Promise.reject('4 error')
      .then()
      .catch((e) => {
        throw e;
      }),
  ];
  withSafeSequence<number>({
    promises,
    onError: async (err) => console.log(err),
    onSuccess: async (data) => console.log(data),
  });
});

test.only('Should enqueue and dequeue queue', async () => {
  const promises = [
    Promise.resolve(0),
    Promise.resolve(1),
    Promise.reject('2 error')
      .then()
      .catch((e) => {
        throw e;
      }),
    Promise.resolve(3),
    Promise.reject('4 error')
      .then()
      .catch((e) => {
        return e;
      }),
  ];

  const queue = new unstable_AsyncQueue();

  queue.enqueue({ task: () => promises[0] });
  queue.enqueue({ task: () => promises[2] });
  queue.enqueue({ task: () => promises[2] });
  await queue.dequeue();
  await queue.dequeue();

  const secondJobResult = queue.track({ jobId: 1 });
  expect(secondJobResult).toBe(null);
});
