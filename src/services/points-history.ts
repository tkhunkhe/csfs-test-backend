import prisma from "../connectors/prisma-client";

/**
 * calculate points history for all userLocations data
 * this is for backward calculate points history
 * this function require complicated join
 * so decided to use mysql procedure and call it instead
 */
const callCalculatePointsHistory = (): Promise<number> => {
  const numRowsUpdated = prisma.$executeRaw`CALL calculatePointsHistory()`;
  return numRowsUpdated;
};

const callCalculatePastPointsAndRank = () => {
  return prisma.$executeRaw`CALL calculatePastPointsAndRank()`;
};

const callCalculateAllHistory = async () => {
  await callCalculatePointsHistory();
  await callCalculatePastPointsAndRank();
};
/**
 * this is for going forward
 * check if nearby any checkpoints and log the points
 * then calculate if match any checkpointsif so, take the latest rankset,
 * add distPoints of the matched user-cp pair
 * to the the total points of the user
 * TODO: consider using trigger and store procedure instead
 */
const onUserLocationAdded = () => {};

export default {
  callCalculatePointsHistory,
  onUserLocationAdded,
  callCalculatePastPointsAndRank,
  callCalculateAllHistory,
};
