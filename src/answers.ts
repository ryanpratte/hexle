// Hexle picks each day's colour from the calendar date, so there is no
// answer list to maintain and it can never run out.
// Everyone who plays on the same calendar date gets the same colour.

const HEX_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

// Change this string to get a completely different sequence of colours.
const SALT = "hexle";

// Day 0 of Hexle (March 2, 2022). Month is zero-indexed.
const EPOCH_UTC = Date.UTC(2022, 2, 2);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Number of calendar days since Hexle #0, using the player's local date.
 * Uses UTC arithmetic on the local Y/M/D so DST changes can't shift the result.
 * Used for the "Hexle 1706" label and for the localStorage key.
 */
export const getHexleNumber = (date: Date): number => {
  const todayUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((todayUtc - EPOCH_UTC) / MS_PER_DAY);
};

// Turn a string into a 32-bit seed (cyrb53-style mixing, truncated to 32 bits).
const hashString = (str: string): number => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
};

// Small seeded PRNG (mulberry32): the same seed always gives the same sequence.
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * The answer for a given date: six hex digits, each chosen by a seeded random
 * index into HEX_DIGITS. Same date in, same colour out, for every player.
 */
export const getAnswer = (date: Date): string => {
  const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const rand = mulberry32(hashString(`${SALT}:${dateKey}`));
  let answer = "";
  for (let i = 0; i < 6; i++) {
    answer += HEX_DIGITS[Math.floor(rand() * HEX_DIGITS.length)];
  }
  return answer;
};
