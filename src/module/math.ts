/**
 *
 * @param target number to display decimals points
 * @param precision how many decimals, default is 2
 * @returns e.g 3.14, number
 */
function toDecimal(target: number, precision: number = 2): number {
  const points = 10 ** precision;
  return Math.round(target * points) / points;
}

function toExponentialBackOff({
  baseDelay,
  attempt,
}: {
  baseDelay: number;
  attempt: number;
}) {
  const timegap = baseDelay + baseDelay * Math.pow(2, attempt);
  return { timegap };
}

export { toDecimal, toExponentialBackOff };
