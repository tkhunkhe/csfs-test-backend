import prisma from "../connectors/prisma-client";

const createCheckpoints = (
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

const getAllCurrentCheckpoints = () => {
  return prisma.checkpoint.findMany({
    where: {
      removedAt: null,
    },
  });
};

const getAllCheckpointsHistory = () => {
  return prisma.checkpoint.findMany({
    // TODO: consider removedAt in the future
    select: { id: true, lat: true, long: true, createdAt: true },
  });
};

/**
 * calculate dist to all user homes
 * then calculate dist points for all existing dist (rebucketize)
 * // TODO:
 */
const onCheckpointAdded = () => {};

export default {
  createCheckpoints,
  getAllCurrentCheckpoints,
  getAllCheckpointsHistory,
};
