import express from "express";
import rankController from "../controllers/rank";
import checkpointController from "../controllers/checkpoints";
import userController from "../controllers/user";
const router = express.Router();

/**
 *TODO: add header authorization check in the future
 */
router.get("/ranks", rankController.getRanks);
router.get("/checkpoints", checkpointController.getCurrentCheckpoints);
router.get("/user/homes", userController.getUserHomes);
router.get(
  "/user/points-detail/:userId",
  userController.getAllPointsHistoryForUser
);

export default router;
