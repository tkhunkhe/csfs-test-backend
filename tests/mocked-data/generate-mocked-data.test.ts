import { randomBetween } from "./generate-mocked-data";
describe("test randomBetween", () => {
  it("should be right", () => {
    const res = randomBetween(-45, -48);
    console.log(res);
  });
});
