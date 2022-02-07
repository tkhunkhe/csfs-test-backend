import checkpoints from "./starter-data/checkpoints";
import moment from "../../src/utils/moment-utils";
import { Moment } from "moment";
import * as fs from "fs";
import { LatLong } from "../interfaces";

const SCOPE = {
  topLat: 45.5375488,
  bottomLat: 45.4977357,
  leftLong: -122.6964694,
  rightLong: -122.6062613,
};
const NUM_USERS = 10;
const NUM_LOCS_PER_USER = 6;
const MAX_NUM_CLOSE_BY_CP_PER_USER = Math.floor(NUM_LOCS_PER_USER / 2);
const ADD_CPs_TIME = moment("2022-02-08 09:30:00");
const ADD_Users_TIME = ADD_CPs_TIME.add(30, "m");
const writeToFile = "tests/mocked-data/map-data.json";

const getCheckpointsWithCreatedAt = () => {
  return checkpoints.map((cp, i) => ({
    id: i + 1,
    ...cp,
    createdAt: moment(),
  }));
};

const randomBetween = (start: number, end: number, tofloor = false) => {
  let num = Math.random() * end;
  if (tofloor) {
    num = Math.floor(num);
  }
  return num + start;
};

const randomFromArr = (arr: Array<any>): LatLong => {
  const maxIndex = arr.length - 1;
  const randIndex = randomBetween(0, maxIndex, true);
  return arr[randIndex];
};

const getNearbyLatLong = (latLong: LatLong): LatLong => {
  return {
    lat: latLong.lat + 0.001,
    long: latLong.long + 0.001,
  };
};

const getRandomBetweenLocs = (
  leftLong: number,
  rightLong: number,
  topLat: number,
  bottomLat: number
) => {
  return {
    lat: randomBetween(topLat, bottomLat),
    long: randomBetween(leftLong, rightLong),
  };
};

const getRandomBetweenScope = () => {
  return getRandomBetweenLocs(
    SCOPE.leftLong,
    SCOPE.rightLong,
    SCOPE.topLat,
    SCOPE.bottomLat
  );
};

const generateUser = () => {
  const results = [];
  for (let i = 1; i <= NUM_USERS; i++) {
    results.push({
      userId: i,
      username: `User ${i}`,
      createdAt: moment(ADD_Users_TIME),
    });
  }
  return results;
};

/**
 * userId,lat,long,createdAt
 */
const generateUserHomes = (): {
  userId: number;
  lat: number;
  long: number;
  createdAt: Moment;
}[] => {
  const results = [];
  for (let i = 1; i <= NUM_USERS; i++) {
    let latlong = getRandomBetweenScope();
    results.push({
      userId: i,
      address: `mocked addresss ${i}`,
      lat: latlong.lat,
      long: latlong.long,
      createdAt: moment(ADD_Users_TIME),
    });
  }
  return results;
};
/**
 * userId,locs:{lat,long,createdAt}[]
 * NUM_CLOSE_BY_CP_PER_USER points must be nearby checkpoints
 */
const generateUserLocs = (): {
  userId: number;
  locs: { lat: number; long: number; createdAt: Moment }[];
}[] => {
  const results = [];
  let id = 1;
  for (let i = 1; i <= NUM_USERS; i++) {
    let locs = [];
    for (let j = 0; j <= NUM_LOCS_PER_USER; j++) {
      let loc = null;
      if (j < i && j < MAX_NUM_CLOSE_BY_CP_PER_USER) {
        // nearby checkpoints
        let cp = randomFromArr(checkpoints);
        loc = getNearbyLatLong(cp);
      } else {
        // some random
        loc = getRandomBetweenScope();
      }
      locs.push({
        id,
        ...loc,
        createdAt: moment(ADD_Users_TIME).add(j + 1, "d"),
      });
      id++;
    }
    results.push({
      userId: i,
      locs,
    });
  }
  return results;
};

const generate = (): {
  users: any[];
  checkpoints: any[];
  userLocs: any[];
} => {
  const usersNoHomes = generateUser();
  const userHomes = generateUserHomes();
  const idToHomes = userHomes.reduce((acc, item) => {
    const { userId, ...rest } = item;
    return { ...acc, [userId]: [rest] };
  }, {});
  const users = usersNoHomes.map((user) => ({
    ...user,
    homes: idToHomes[user.userId],
  }));
  return {
    users,
    checkpoints: getCheckpointsWithCreatedAt(),
    userLocs: generateUserLocs(),
  };
};

const main = () => {
  const obj = generate();
  const json = JSON.stringify(obj);
  fs.writeFile(writeToFile, json, "utf8", (err) => {
    console.log(`finished writing to file ${writeToFile}`);
  });
};

main();
