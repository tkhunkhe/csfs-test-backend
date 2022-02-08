import addressServ from "../../src/services/address";
const mockedAddress = "9901 N Hurst Ave, Portland, OR 97203, United States";

describe.skip("test mapquest address", () => {
  it("should get lat long", async () => {
    const latLong = await addressServ.getLatLongForAddress(mockedAddress);
    expect(latLong).toBeDefined();
    expect(latLong.lat).toBeDefined();
  });
});
