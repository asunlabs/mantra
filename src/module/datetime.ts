/**
 * @dev convert kst to utc in `full:yyyy-mm-dd hh:mm;ss` and `short:yyyy-mm-dd` format
 */
function fromUTC() {
  const date = new Date();
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const full = kstDate.toISOString().replace("T", " ").slice(0, 19);
  const short = full.slice(0, 10);

  return { full, short };
}

function calculateTimeRange(offset: number): [string, string] {
  const date = new Date();
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const today = kstDate.toISOString().slice(0, 10);

  kstDate.setDate(kstDate.getDate() - offset);
  const interval = kstDate.toISOString().slice(0, 10);

  return [today, interval];
}

export { fromUTC, calculateTimeRange };
