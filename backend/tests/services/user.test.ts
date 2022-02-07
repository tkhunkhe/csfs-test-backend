import prisma from "../../src/connectors/prisma-client";
import userServ from "../../src/services/user";
import mUserHelp from "../mocked-data/user";

const mockedUser = mUserHelp.user;
const mockedUserWithAddr = mUserHelp.userWithAddr;
export const initUser = async (user) => {
  let createUser = null;
  let data = user;
  if (user.address && !user.homes) {
    const { username, ...rest } = user;
    data = { username, homes: { create: [rest] } };
  } else if (user.homes) {
    const { homes, ...rest } = user;
    data = { ...rest, homes: { create: homes } };
  }
  try {
    createUser = await prisma.user.create({
      data,
    });
    console.debug(`createUser:`, createUser);
    return createUser.id;
  } catch (err) {
    console.error(err);
    createUser = await prisma.user.findUnique({
      where: { username: user.username },
    });
  }
  return createUser.id;
};

export const clearUser = async () => {
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
    await userServ.createUser(m.username, m.address, m.lat, m.long);
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
            lat: true,
            long: true,
          },
        },
      },
    });
    expect(res).toBeDefined();
    expect(res).toHaveLength(1);
    expect(res[0].username).toBe(m.username);
    expect(res[0].homes).toContainEqual({
      address: m.address,
      lat: m.lat,
      long: m.long,
    });
  });
});
