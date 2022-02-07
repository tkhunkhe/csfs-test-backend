import prisma from "../connectors/prisma-client";

const createCheckpoints = async (
  checkpoints: {
    id?: number;
    createdAt?: any;
    name: string;
    lat: number;
    long: number;
  }[]
) => {
  return prisma.checkpoint.createMany({
    data: checkpoints,
  });
};

const getAllCurrentCheckpoints = async () => {
  return prisma.checkpoint.findMany({
    where: {
      removedAt: null,
    },
  });
};

export default {
  createCheckpoints,
  getAllCurrentCheckpoints,
};
