import express, { Request, Response } from "express";
import rankController from "../controllers/rank";
const router = express.Router();

/**
 *TODO: add header authorization check in the future
 */
router.get("/ranks", rankController.getRanks);
export default router;
