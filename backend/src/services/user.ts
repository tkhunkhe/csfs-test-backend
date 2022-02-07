import prisma from "../connectors/prisma-client";

const createUser = async (username: string, homeAddress: string) => {
  return prisma.user.create({
    data: {
      username,
      homes: {
        create: [{ address: homeAddress }],
      },
    },
  });
};

const getUser = async (userId: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export default {
  getUser,
  createUser,
};
