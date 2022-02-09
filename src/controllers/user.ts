import { Request, Response } from "express";
import pointsHistory from "../services/points-history";
import userServ from "../services/user";

const getUserHomes = async (req: Request, res: Response) => {
  const data = await userServ.getAllUsers();
  return res.status(200).send(data);
};

const getAllPointsHistoryForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const intUserId = parseInt(userId);
  let data = null;
  if (userId && !isNaN(intUserId)) {
    const result = await pointsHistory.getAllPointsHistoryForUser(intUserId);

    data = result.map((each) => {
      const { dPoints, uLoc, ...rest } = each;
      const { createdAt: uLocCreatedAt, ...restULoc } = uLoc;
      return { ...rest, ...dPoints, ...restULoc, uLocCreatedAt };
    });
  }
  return res.status(200).send(data);
};

export default {
  getUserHomes,
  getAllPointsHistoryForUser,
};
