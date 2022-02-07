import prisma from "../connectors/prisma-client";

const createLocations = async (
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

export default {
  createLocations,
};
