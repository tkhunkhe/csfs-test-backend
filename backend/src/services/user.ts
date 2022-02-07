import prisma from "../connectors/prisma-client";

const createUser = async (
  username: string,
  homeAddress: string,
  lat?: number,
  long?: number,
  userId?: number,
  createdAt?: any
) => {
  return prisma.user.create({
    data: {
      id: userId,
      username,
      createdAt,
      homes: {
        create: [{ address: homeAddress, lat, long }],
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
