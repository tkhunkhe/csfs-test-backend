import prisma from "../connectors/prisma-client";

const createLocations = (
  locs: {
    id?: number;
    createdAt?: any;
    userId: number;
    lat: number;
    long: number;
  }[]
) => {
  return prisma.userLocation.createMany({
    data: locs,
  });
};

const getAllUsersLocations = () => {
  return prisma.userLocation.findMany({
    select: {
      id: true,
      createdAt: true,
      userId: true,
      lat: true,
      long: true,
    },
  });
};

export default {
  createLocations,
  getAllUsersLocations,
};
