import listUtils from "../utils/list-utils";
import prisma from "../connectors/prisma-client";
import distanceServ from "./distance";
import moment from "../utils/moment-utils";
import { Moment } from "moment";

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
 * @param debug include cpId, km if debug = True
 * @returns
 */
const calculatePointsForAllUsers = async (
  debug = false
): Promise<{ data: any[]; maxCreatedAt: Moment | String }> => {
  // query current distances for each home (no disabled)
  // distances are sorted desc
  const users = await distanceServ.getAllUsersCurrentDistances();
  let allData = [];
  const cpDistsCreatedAts = users.reduce(
    (acc, user) => acc.concat(user.cpDists.map((cpDist) => cpDist.createdAt)),
    []
  );
  const maxCreatedAt = cpDistsCreatedAts.reduce(
    (max, createdAt) =>
      moment(createdAt).isSameOrAfter(max) ? createdAt : max,
    moment().subtract(999, "y")
  );
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
  return { data: allData, maxCreatedAt };
};

/**
 * create pointsSet and points
 */
const calculateAndStorePointsForAllUsers = async () => {
  const { data: distPoints, maxCreatedAt } = await calculatePointsForAllUsers();
  return storePointsSet({
    createdAt: maxCreatedAt,
    distPoints,
  });
};

/**
 * how many points each user can earn for reaching each checkpoint
 * all pre calculated points, not the user's points
 * @returns
 */
const getAllPointsForAllUsers = () => {
  return prisma.distancePoints.findMany({
    select: {
      id: true,
      dist: {
        select: {
          id: true,
          // km: true,
          distPoints: true,
          cpId: true,
          userId: true,
        },
      },
      distPointsSet: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
  });
};

export default {
  calculatePointsForAllUsers,
  calculateAndStorePointsForAllUsers,
  getAllPointsForAllUsers,
};
