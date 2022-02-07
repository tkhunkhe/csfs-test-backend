import cpMatch from "../../src/services/checkpoint-match";
// mocked data a is far from b (50m), a is close to c (11m)
const getLatLongObj = (lat, long) => {
  return { lat, long };
};
const bLoc = getLatLongObj(45.59422440864667, -122.70877294159375);
const aLoc = getLatLongObj(45.59418654066236, -122.70909663393049);
const cLoc = getLatLongObj(45.5942885850854, -122.70820574837255);
describe("test a to b distance", () => {
  it("should be around 0.25", () => {
    const dist = cpMatch.distanceAToB(aLoc, bLoc);
    expect(dist).toBeCloseTo(0.25, 1);
  });
  it("should be around 0.70", () => {
    const dist = cpMatch.distanceAToB(aLoc, cLoc);
    expect(dist).toBeCloseTo(0.7, 1);
  });
});

describe("test a to b close by", () => {
  it("should be close", () => {
    const isClose = cpMatch.isACloseToB(aLoc, bLoc);
    expect(isClose).toBeTruthy();
  });
  it("should be not close", () => {
    const isClose = cpMatch.isACloseToB(aLoc, cLoc);
    expect(isClose).toBeFalsy();
  });
});
