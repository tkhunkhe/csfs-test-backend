import { LatLong } from "../interfaces";

export const clostByKMThreshold = 25; // km
export const acceptableKMOff = 2; // km(2m)
/**
 * find distance between two locations in m
 * formula source: https://www.movable-type.co.uk/scripts/latlong.html
 * @param a
 * @param b
 * @returns number: distance in m
 */
const distanceAToB = <A extends LatLong, B extends LatLong>(
  a: A,
  b: B
): number => {
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
  //   console.debug(`rad: ${R}. m: ${d}`);
  return d;
};
const isACloseToB = <A extends LatLong, B extends LatLong>(
  a: A,
  b: B
): boolean => {
  const dist = distanceAToB<A, B>(a, b);
  return dist <= clostByKMThreshold + acceptableKMOff;
};

const getCloseByCheckpoints = <A extends LatLong, B extends LatLong>(
  a: A,
  checkpoints: B[]
): B[] => {
  return checkpoints.filter((cp) => isACloseToB<A, B>(a, cp));
};

export default {
  distanceAToB,
  isACloseToB,
  getCloseByCheckpoints,
};
