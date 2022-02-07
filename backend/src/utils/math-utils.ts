const divmod = (y, x): number[] => {
  const quotient = Math.floor(y / x);
  const remainder = y % x;
  return [quotient, remainder];
};
export default {
  divmod,
};
