const substring = (from: string, prefix: string): string => {
  if (prefix.length >= from.length) return "";
  return from.substring(prefix.length + 1);
};

export default substring;
