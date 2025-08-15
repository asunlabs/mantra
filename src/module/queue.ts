import { withNoThrow } from './promise';

type TaskType<T> = () => Promise<T>;

class unstable_AsyncQueue<T> {
  #queue: TaskType<T>[] = [];
  #isRunning = false;
  #taskId = 0;
  #jobId = 0;
  #result = new Map<number, T | null>();

  constructor() {
    this.#isRunning = true;
  }

  async enqueue({ task }: { task: TaskType<T> }) {
    try {
      this.#queue.push(task);
      console.info(`${task.name}:taskId(${this.#taskId})`);
      this.#taskId++;
    } catch (error) {
      // silence error
    }
  }

  async dequeue() {
    const task = this.#queue.shift();
    if (!task) {
      console.warn('queue is empty');
      return this.pause();
    }

    const runner = withNoThrow({ callback: async () => await task() });
    const { value, done } = await runner.next();
    if (done) {
      console.info(`dequeue: job is done`);
      return this.pause();
    }

    const { data, error } = value;
    if (error !== null) {
      this.enqueue({ task });
      this.#result.set(this.#jobId, null);
      console.error(`dequeue: failed to run task(${this.#jobId})`);
      this.#jobId++;
    }
    if (data !== null) {
      this.#result.set(this.#jobId, data);
      console.info(`dequeue: executed task(${this.#jobId})`);
      this.#jobId++;
    }
  }

  pause() {
    this.#isRunning = false;
  }

  resume() {
    this.#isRunning = true;
  }

  track({ jobId }: { jobId: number }) {
    return this.#result.get(jobId);
  }

  size() {
    return this.#queue.length;
  }
}

export { unstable_AsyncQueue };
