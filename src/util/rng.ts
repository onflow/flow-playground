const CHARS = "0123456789ABCDEF".split("");
const randChar = (): string => CHARS[~~(Math.random() * CHARS.length)];
const group = (length: number): string =>
  Array.from({ length }, () => randChar()).join("");
export const uuid = (): string =>
  [group(8), group(4), group(4), group(4), group(12)].join("-");

export const mb32 = (a: number) => {
  let t;
  return (): number => {
    return (
      ((a = (a + 1831565813) | 0),
      (t = Math.imul(a ^ (a >>> 15), 1 | a)),
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      (t ^ (t >>> 14)) >>> 0) /
      2 ** 32
    );
  };
};

export const strToSeed = (seed: string): number => {
  if (typeof TextEncoder == "undefined") return Math.random() * 32;
  const td = new TextEncoder();
  return td.encode(seed).reduce((a, b) => a + b);
};
