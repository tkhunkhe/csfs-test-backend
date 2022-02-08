import { LatLong } from "../interfaces";

const getLatLongObj = (lat: number, long: number): LatLong => {
  return { lat, long };
};

export default {
  getLatLongObj,
};
