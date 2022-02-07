import { clearUser, initUser } from "./user.test";
import mockedUHelp from "../mocked-data/user";
import homeServ from "../../src/services/home";

const mockedUser = mockedUHelp.userWithTwoAddrs;

describe("test get user latest home", () => {
  let userId = null;
  let res = null;
  beforeAll(async () => {
    await clearUser();
    userId = await initUser(mockedUser);
    res = await homeServ.getUserLatestHome(userId);
  });
  afterAll(async () => {
    await clearUser();
  });
  it("should exist", async () => {
    expect(res).toBeDefined();
  });
  it("should have the right address", async () => {
    expect(res.address).toBe(mockedUser.homes[1].address);
  });
});

describe("test get all users latest home", () => {
  let userId = null;
  let res = null;
  it("should exist", async () => {
    expect(res).toBeDefined();
  });
});
