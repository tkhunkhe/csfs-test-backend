import pointsServ from "../../src/services/points";
describe("test calculate points for all users", () => {
  let res;
  beforeAll(async () => {
    res = await pointsServ.calculatePointsForAllUsers(true);
  });
  it("should exists", () => {
    expect(res).toBeDefined();
  });
  it("should have data", () => {
    expect(res).toHaveProperty("data");
  });
  it("should have data as array", () => {
    expect(res.data).toBeArray();
  });
  it("should have maxCreatedAt", () => {
    expect(res).toHaveProperty("maxCreatedAt");
  });
});
