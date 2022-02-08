import pointsHistory from "../../src/services/points-history";
describe("test calculate all users points history", () => {
  let res;
  beforeAll(async () => {
    res = await pointsHistory.calculateAllUsersPointsHistory();
  });
  it("should exists", () => {
    expect(res).toBeDefined();
  });
});
