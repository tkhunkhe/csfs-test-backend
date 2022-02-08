import prisma from "../../src/connectors/prisma-client";
import userServ from "../../src/services/user";
import mUserHelp from "../mocked-data/user";

const mockedUser = mUserHelp.user;
const mockedUserWithAddr = mUserHelp.userWithAddr;
export const initUser = async (user) => {
  let createUser = null;
  try {
    createUser = await prisma.user.create({
      data: user,
    });
  } catch (err) {
    console.error(err);
    createUser = await prisma.user.findUnique({
      where: { username: user.username },
    });
  }
  // console.debug(`createUser:`, createUser);
  return createUser.id;
};

export const clearUser = async () => {
  try {
    const removeUser = await prisma.user.delete({
      where: mockedUser,
    });
    // console.debug(`removeUser:`, removeUser);
  } catch (err) {
    if (err.code == "P2025") {
      // cause 'Record to delete does not exist.'
      console.debug(err.meta);
    } else {
      console.error(err);
    }
  }
};

describe("test get user", () => {
  let userId: number = null;
  let res = null;
  beforeAll(async () => {
    await clearUser();
    userId = await initUser(mockedUserWithAddr);
    res = await userServ.getUser(userId);
  });
  afterAll(async () => {
    await clearUser();
  });
  it("should find user", async () => {
    expect(res).toMatchObject(mockedUserWithAddr);
  });
});

describe("test create user", () => {
  const m = mockedUserWithAddr;
  let res = null;
  beforeAll(async () => {
    await userServ.createUser(m);
  });
  afterAll(async () => {
    await clearUser();
  });
  it("should find user with just created info (username, address)", async () => {
    res = await prisma.user.findMany({
      where: {
        username: m.username,
        address: m.address,
      },
    });
    expect(res).toBeDefined();
    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject(m);
  });
});
