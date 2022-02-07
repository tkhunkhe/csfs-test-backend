import prisma from "../../src/connectors/prisma-client";
import userServ from "../../src/services/user";

const mockedUser = { username: "unittest-test-data" };
const mockedUserWithAddr = {
  ...mockedUser,
  address: "9901 N Hurst Ave, Portland, OR 97203, United States",
};
const initUser = async (user) => {
  let createUser = null;
  try {
    createUser = await prisma.user.create({
      data: user,
    });
    console.debug(`createUser:`, createUser);
    return createUser.id;
  } catch (err) {
    console.error(err);
    createUser = await prisma.user.findUnique({
      where: user,
    });
  }
  return createUser.id;
};

const clearUser = async () => {
  try {
    const removeUser = await prisma.user.delete({
      where: mockedUser,
    });
    console.debug(`removeUser:`, removeUser);
  } catch (err) {
    console.error(err);
  }
};

describe("test get user", () => {
  let userId: number = null;
  let res = null;
  beforeAll(async () => {
    await clearUser();
    userId = await initUser(mockedUser);
    res = await userServ.getUser(userId);
  });
  afterAll(async () => {
    await clearUser();
  });
  it("should find user", async () => {
    expect(res).toMatchObject(mockedUser);
  });
});

describe("test create user", () => {
  const m = mockedUserWithAddr;
  let res = null;
  beforeAll(async () => {
    await userServ.createUser(m.username, m.address);
  });
  afterAll(async () => {
    await clearUser();
  });
  it("should find user with just created info (username, address)", async () => {
    res = await prisma.user.findMany({
      where: {
        username: m.username,
        homes: {
          some: {
            address: m.address,
          },
        },
      },
      include: {
        homes: {
          select: {
            address: true,
          },
        },
      },
    });
    expect(res).not.toBeNull();
    expect(res).toHaveLength(1);
    expect(res[0].username).toBe(m.username);
    expect(res[0].homes).toContainEqual({ address: m.address });
  });
});
