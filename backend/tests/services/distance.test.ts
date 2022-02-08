import distanceServ from "../../src/services/distance";

describe("test calculate distance", () => {
  let res;
  beforeAll(async () => {
    res = await distanceServ.calculateCurrentDistances();
  });
  it("should have distances", () => {
    expect(res).toBeDefined();
  });
});

describe("test get all users distances", () => {
  let res;
  beforeAll(async () => {
    res = await distanceServ.getAllUsersCurrentDistances();
    // console.debug("example", JSON.stringify(res[0]));
  });
  it("should exists", () => {
    expect(res).toBeDefined();
  });
});
