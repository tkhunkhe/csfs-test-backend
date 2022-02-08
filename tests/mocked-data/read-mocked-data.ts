import jsonUtils from "../../src/utils/json-utils";

const read = (): Promise<{
  users: any[];
  checkpoints: any[];
  userLocs: any[];
}> => {
  return jsonUtils.readJsonFile("tests/mocked-data/map-data.json") as any;
};

export default {
  read,
};
