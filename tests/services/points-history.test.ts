import pointsHistory from "../../src/services/points-history";
describe("test call calculate all users points history", () => {
  let res;
  beforeAll(async () => {
    res = await pointsHistory.callCalculatePointsHistory();
  });
  it("should exists", () => {
    expect(res).toBeDefined();
  });
});

describe("test callCalculatePastPointsAndRank", () => {
  let res;
  beforeAll(async () => {
    res = await pointsHistory.callCalculatePastPointsAndRank();
  });
  it("should exists", () => {
    console.debug(res);
    expect(res).toBeDefined();
  });
});

describe("test getAllPointsHistoryForUser", () => {
  let res;
  const userId = 7;
  beforeAll(async () => {
    res = await pointsHistory.getAllPointsHistoryForUser(userId);
  });
  it("should exists", () => {
    console.debug(JSON.stringify(res));
    expect(res).toBeDefined();
  });
});
