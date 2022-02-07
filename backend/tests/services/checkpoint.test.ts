import checkpointServ from "../../src/services/checkpoint";

describe("test get all current checkpoints", () => {
  it("should exists", async () => {
    const res = checkpointServ.getAllCurrentCheckpoints();
    expect(res).toBeDefined();
  });
});
