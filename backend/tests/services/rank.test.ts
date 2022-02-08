import rankServ from "../../src/services/rank";
describe("test rank getLatestRankSetRanks", () => {
  let res;
  beforeAll(async () => {
    res = await rankServ.getLatestRankSetRanks();
  });
  it("should exists", () => {
    // console.debug(res);
    expect(res).toBeDefined();
  });
  it("should have rankHists", () => {
    expect(res).toHaveProperty("rankHists");
  });
  it("should have rankHists as array", () => {
    expect(res.rankHists).toBeArray();
  });
});
