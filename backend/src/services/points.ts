import listUtils from "../utils/list-utils";
import prisma from "../connectors/prisma-client";
import distanceServ from "./distance";

const MAX_POINTS = 10;
/**
 * distance points set and distance points
 * calculated for all homes and all checkpoints at the time
 * each user should have the fair chance to reach the same score
 */

/**
 * one pointsSet per calculation
 * a pointsSet is updated (points added) when there is a new user
 * a pointsSet is created when there is a new checkpoint
 * @param pointsSet
 * @returns
 */
const storePointsSet = (pointsSet) => {
  const data = pointsSet?.distPoints
    ? {
        ...pointsSet,
        distPoints: { createMany: { data: pointsSet.distPoints } },
      }
    : pointsSet;
  return prisma.distancePointsSet.create({
    data,
  });
};

/**
 *
 * @param debug include cpId, km if debug = True
 * @returns
 */
const calculatePointsForAllUsers = async (debug = false) => {
  // query current distances for each home (no disabled)
  // distances are sorted desc
  const users = await distanceServ.getAllUsersCurrentDistances();
  let allData = [];
  for (let user of users) {
    const cpDistsChunks = listUtils.split(user.cpDists, MAX_POINTS);
    let data = cpDistsChunks.reduce((acc, chunk, i) => {
      let points = MAX_POINTS - i;
      const chunkResults = chunk.map((cpDist) => {
        const { id, ...rest } = cpDist;
        let result = { distId: id, points };
        if (debug) {
          result = { ...result, ...rest };
        }
        return result;
      });
      return acc.concat(chunkResults);
    }, []);
    allData = allData.concat(data);
  }
  return allData;
};

/**
 * create pointsSet and points
 */
const calculateAndStorePointsForAllUsers = async () => {
  const distPoints = await calculatePointsForAllUsers();
  return storePointsSet({
    distPoints,
  });
};

export default {
  calculatePointsForAllUsers,
  calculateAndStorePointsForAllUsers,
};
