import * as fs from "fs";
/**
 * read file and get javascript object
 */
const readJsonFile = (filepath: string) => {
  return new Promise((resolve) => {
    fs.readFile(filepath, "utf-8", (err, data: any) => {
      if (err) throw err;
      const parsed = JSON.parse(data);
      return resolve(parsed);
    });
  });
};

export default {
  readJsonFile,
};
