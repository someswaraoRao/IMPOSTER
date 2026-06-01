/** Generate a random 4-character uppercase room code */
export function genCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}
