/** returns a random number */
export const randNum = (min, max) => {
  return Math.random() * (max - min) + min;
}
/** returns a random integer */
export const randInt = (min, max) => {
  return Math.round(randNum(min, max))
}
