import { Request, Response } from "express";
import checkpointServ from "../services/checkpoint";

const getCurrentCheckpoints = async (req: Request, res: Response) => {
  const data = await checkpointServ.getAllCurrentCheckpoints();
  return res.status(200).send(data);
};

export default {
  getCurrentCheckpoints,
};
