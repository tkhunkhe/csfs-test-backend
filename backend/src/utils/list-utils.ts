import mathUtils from "./math-utils";

/**
 * split array arr into n chunks
 * @param arr
 * @param n
 * @returns
 */
const split = (arr: any[], n: number) => {
  const [k, m] = mathUtils.divmod(arr.length, n);
  let results = [];
  for (let i = 0; i < n; i++) {
    let chunk = arr.slice(
      i * k + Math.min(i, m),
      (i + 1) * k + Math.min(i + 1, m)
    );
    results.push(chunk);
  }
  return results;
};

export default {
  split,
};
