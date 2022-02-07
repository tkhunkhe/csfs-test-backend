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

export default {
  createCheckpoints,
};
