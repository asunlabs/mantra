async function withTimeout({
  callback,
  ms,
}: {
  callback: () => Promise<void>;
  ms: number;
}) {
  const _timeout = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `timeout: waited ${ms}ms for callback(${callback.name}) to perform but timed out`
          )
        );
      }, ms);
    });
  return Promise.race([callback(), _timeout()]);
}

async function withDelay({
  callback,
  ms,
}: {
  callback: () => Promise<void>;
  ms: number;
}) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await callback();
}
export { withTimeout, withDelay };
