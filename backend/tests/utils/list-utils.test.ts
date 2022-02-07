import listUtils from "../../src/utils/list-utils";

describe("test split range(11) to 3 chunks", () => {
  let arr = Array(11)
    .fill(0)
    .map((_, i) => i);
  let res;
  beforeAll(() => {
    res = listUtils.split(arr, 3);
  });
  it("should give 3 chunks", () => {
    expect(res).toHaveLength(3);
  });
  it("should give right chunks", () => {
    expect(res).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10],
    ]);
  });
});
