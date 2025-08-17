import { expect, test } from '@jest/globals';
import { unstable_AsyncQueue } from '../src/module/queue';

test('Should enqueue and dequeue queue', async () => {
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
