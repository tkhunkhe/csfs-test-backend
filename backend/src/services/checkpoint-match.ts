const clostByKMThreshold = 0.25; // km
const acceptableKMOff = 0.02; // km(2m)
/**
 * find distance between two locations in km
 * formula source: https://medium.com/analytics-vidhya/finding-nearest-pair-of-latitude-and-longitude-match-using-python-ce50d62af546
 * @param a
 * @param b
 * @returns number: distance in km
 */
const distanceAToB = (a: LatLong, b: LatLong): number => {
  const lat1 = a.lat,
    lat2 = b.lat,
    lon1 = a.long,
    lon2 = b.long;
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const d =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const radD = 2 * Math.asin(Math.sqrt(d));
  const km = 6371 * radD; // distance in km
  console.debug(`rad: ${radD}. km: ${km}`);
  return km;
};
const isACloseToB = (a: LatLong, b: LatLong): boolean => {
  const dist = distanceAToB(a, b);
  return dist <= clostByKMThreshold + acceptableKMOff;
};
export default {
  distanceAToB,
  isACloseToB,
};
