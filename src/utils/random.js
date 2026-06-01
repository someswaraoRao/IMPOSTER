/** Return a random element from an array */
export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Return a random integer between min (inclusive) and max (exclusive) */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
