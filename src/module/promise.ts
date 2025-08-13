import {
  GeneratorYieldType,
  GeneratorNextParameterType,
  GeneratorErrorType,
  GeneratorSuccessType,
  GeneratorReturnType,
} from "@/types/definition";

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

async function withBulk<T>({ promises }: { promises: Promise<T>[] }) {
  const result = await Promise.allSettled(promises);
  const resolved = result
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<T>> => r.status === "fulfilled"
    )
    .map((r) => r.value);
  const rejected = result
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason);

  const hasError = rejected.length > 0;
  return { resolved, rejected, hasError };
}

async function* withNoThrow<T, R>({
  callback,
}: {
  callback: () => Promise<T>;
}): AsyncGenerator<
  GeneratorYieldType<T>,
  GeneratorReturnType,
  GeneratorNextParameterType<R>
> {
  try {
    yield {
      data: await callback(),
      error: null,
    };
  } catch (error) {
    yield {
      data: null,
      error,
    };
  }
}

async function withSafeSequence<T>({
  promises,
  onError,
  onSuccess,
}: {
  promises: Promise<T>[];
  onError: (error: GeneratorErrorType["error"], index: number) => Promise<void>;
  onSuccess: (
    data: GeneratorSuccessType<T>["data"],
    index: number
  ) => Promise<void>;
}) {
  for (const [index, p] of promises.entries()) {
    const runner = withNoThrow<T, void>({
      callback: async () => await p,
    });
    const { value, done } = await runner.next();

    if (done) break;
    if (value.error) {
      await onError(value.error, index);
      continue;
    }
    if (value.data) {
      await onSuccess(value.data, index);
    }
  }
}
export { withTimeout, withDelay, withBulk, withNoThrow, withSafeSequence };
