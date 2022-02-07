import pointsServ from "../../src/services/points";
describe("test calculate points for all users", () => {
  let res;
  beforeAll(async () => {
    res = await pointsServ.calculatePointsForAllUsers(true);
    console.debug(res);
  });
  it("should exists", () => {
    expect(res).toBeDefined();
  });
});
