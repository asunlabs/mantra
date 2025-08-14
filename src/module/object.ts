function hasKey({ target, key }: { target: any; key: string }) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export { hasKey };
