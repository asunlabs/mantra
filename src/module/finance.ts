function toKRW({ amount }: { amount: number }) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

export { toKRW };
