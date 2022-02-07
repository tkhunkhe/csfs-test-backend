import { Request, Response } from "express";
import userServ from "../services/user";

const addUser = (req: Request, res: Response) => {
  const body = req.body;
  // NOTE: can add validate input in the future
  // TODO: find lat long
  userServ.createUser(body.username, body.address);
  return res.status(200);
};

export default {
  addUser,
};
