import checkpointServ from "./checkpoint";
import userServ from "./user";
import prisma from "../connectors/prisma-client";
import latlongUtil from "../utils/latlong-util";
import { LatLong } from "../interfaces";

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
      let m = distanceAToB(latlongH, latlongCP);
      data.push({
        km: m / 1000,
        userId: user.id,
        cpId: cp.id,
      });
    });
  });

  return data;
};
const calculateAndStoreCurrentDistances = async () => {
  const data = await calculateCurrentDistances();
  return await storeDistances(data);
};

export const clostByKMThreshold = 25; // km
export const acceptableKMOff = 2; // km(2m)
/**
 * find distance between two locations in m
 * formula source: https://www.movable-type.co.uk/scripts/latlong.html
 * @param a
 * @param b
 * @returns number: distance in m
 */
const distanceAToB = (a: LatLong, b: LatLong): number => {
  const lat1 = a.lat,
    lat2 = b.lat,
    lon1 = a.long,
    lon2 = b.long;
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const aa =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));

  const d = R * c; // in metres
  console.debug(`rad: ${R}. m: ${d}`);
  return d;
};
const isACloseToB = (a: LatLong, b: LatLong): boolean => {
  const dist = distanceAToB(a, b);
  return dist <= clostByKMThreshold + acceptableKMOff;
};

const getCloseByCheckpoints = (
  a: LatLong,
  checkpoints: LatLong[]
): LatLong[] => {
  return checkpoints.filter((cp) => isACloseToB(a, cp));
};

export default {
  calculateAndStoreCurrentDistances,
  calculateCurrentDistances,
  distanceAToB,
  isACloseToB,
  getCloseByCheckpoints,
};
