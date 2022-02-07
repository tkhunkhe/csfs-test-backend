/**
 * node generate-map-data.ts > tests/mocked-data/map-data.ts
 */
import * as fs from "fs";
import csv from "csv-parser";

let results = {
  checkpoints: [],
  userHomes: [],
  userLocations: [],
};
const fileNameToResKey = {
  checkpoints: "checkpoints",
  "user-homes": "userHomes",
  "user-locations": "userLocations",
};
const baseURI = "tests/mocked-data/starter-data";

const main = () => {
  Object.entries(fileNameToResKey).forEach(([fileName, resKey]) => {
    fs.createReadStream(`${baseURI}/${fileName}.csv`)
      .pipe(csv())
      .on("data", (data) => results[resKey].push(data))
      .on("end", () => {
        console.log(results);
      });
  });
};

main();
