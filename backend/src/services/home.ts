import prisma from "../connectors/prisma-client";

// NOTE: can do this in the future
const changeHome = (userId: number, address: string) => {};

const getUserHomes = async (userId: number) => {
  return prisma.home.findMany({
    where: {
      userId: userId,
    },
  });
};

const getUserLatestHome = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      homes: {
        orderBy: {
          id: "desc",
        },
        take: 1,
      },
    },
  });
  return user.homes?.length ? user.homes[0] : null;
};

const getAllUsersLatestHomes = async () => {
  const allUsers = await prisma.user.findMany({
    include: {
      homes: {
        orderBy: {
          id: "desc",
        },
        take: 1,
      },
    },
  });
  return allUsers
    .map((user) => {
      if (user.homes.length) {
        return { userId: user.id, ...user.homes[0] };
      }
    })
    .filter((home) => !!home);
};

export default {
  changeHome,
  getUserHomes,
  getUserLatestHome,
  getAllUsersLatestHomes,
};
