import latlongUtil from "../../src/utils/latlong-util";
import distanceHelp from "../../src/helpers/distance";

const bLoc = latlongUtil.getLatLongObj(45.59422440864667, -122.70877294159375);
const aLoc = latlongUtil.getLatLongObj(45.59418654066236, -122.70909663393049);
const cLoc = latlongUtil.getLatLongObj(45.5942885850854, -122.70820574837255);
describe("test a to b distance", () => {
  it("should be around 25", () => {
    const dist = distanceHelp.distanceAToB(aLoc, bLoc);
    expect(Math.floor(dist)).toBe(25);
  });
  it("should be around 70", () => {
    const dist = distanceHelp.distanceAToB(aLoc, cLoc);
    expect(Math.floor(dist)).toBe(70);
  });
});

describe("test a to b close by", () => {
  it("should be close", () => {
    const isClose = distanceHelp.isACloseToB(aLoc, bLoc);
    expect(isClose).toBeTruthy();
  });
  it("should be not close", () => {
    const isClose = distanceHelp.isACloseToB(aLoc, cLoc);
    expect(isClose).toBeFalsy();
  });
});
