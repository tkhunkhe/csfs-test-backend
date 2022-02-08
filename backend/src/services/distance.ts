import checkpointServ from "./checkpoint";
import userServ from "./user";
import prisma from "../connectors/prisma-client";
import latlongUtil from "../utils/latlong-util";
import moment from "../utils/moment-utils";
import distanceHelp from "../helpers/distance";

const storeDistances = async (distances) => {
  return prisma.distance.createMany({
    data: distances,
  });
};
/**
 * calculate for all user's current home to all current checkpoints
 */
const calculateCurrentDistances = async () => {
  // query all latest home
  const users = await userServ.getAllUsers();
  const checkpoints = await checkpointServ.getAllCurrentCheckpoints();
  const data = [];
  users.forEach((user) => {
    let latlongH = latlongUtil.getLatLongObj(user.lat, user.long);
    checkpoints.forEach((cp) => {
      let latlongCP = latlongUtil.getLatLongObj(cp.lat, cp.long);
      let m = distanceHelp.distanceAToB(latlongH, latlongCP);
      data.push({
        km: m / 1000,
        userId: user.id,
        cpId: cp.id,
        // created at of distance should be at the later time of cp or user creation
        createdAt: moment(cp.createdAt).isSameOrAfter(user.createdAt)
          ? cp.createdAt
          : user.createdAt,
      });
    });
  });

  return data;
};
const calculateAndStoreCurrentDistances = async () => {
  const data = await calculateCurrentDistances();
  return await storeDistances(data);
};

/**
 * include sort distances
 * @returns
 */
const getAllUsersCurrentDistances = () => {
  return prisma.user.findMany({
    select: {
      cpDists: {
        where: {
          disabledAt: null,
        },
        orderBy: {
          km: "desc",
        },
        select: {
          id: true,
          userId: true,
          cpId: true,
          km: true,
          createdAt: true,
        },
      },
    },
  });
};

export default {
  calculateAndStoreCurrentDistances,
  calculateCurrentDistances,
  getAllUsersCurrentDistances,
};
