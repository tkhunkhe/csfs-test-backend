import { Request, Response } from "express";
import rankServ from "../services/rank";

const getRanks = async (req: Request, res: Response) => {
  const data = await rankServ.getLatestRankSetRanks();
  return res.status(200).send(data);
};

export default {
  getRanks,
};
