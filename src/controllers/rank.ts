import { Request, Response } from "express";

interface RankRes {
  rank: number;
  username: string;
  points: number; // total points
  change: "UP" | "DOWN" | "NONE";
}
const getRanks = (req: Request, res: Response) => {
  const data: RankRes[] = [
    {
      rank: 1,
      username: "mocked user 1",
      points: 20, // total points
      change: "UP",
    },
    {
      rank: 2,
      username: "mocked user 2",
      points: 15, // total points
      change: "DOWN",
    },
    {
      rank: 3,
      username: "mocked user 3",
      points: 12, // total points
      change: "NONE",
    },
  ];
  return res.status(200).send(data);
};

export default {
  getRanks,
};
