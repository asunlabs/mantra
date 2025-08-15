import * as datetime from './module/datetime';
import * as math from './module/math';
import * as promise from './module/promise';
import * as finance from './module/finance';
import * as object from './module/object';
import * as queue from './module/queue';

const Mantra = {
  datetime,
  math,
  promise,
  finance,
  object,
  queue,
} as const;

export default Mantra;
export { datetime, math, promise, finance, object, queue };
