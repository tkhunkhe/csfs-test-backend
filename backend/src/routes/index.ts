import express from "express";

const router = express.Router();
router.get("/", (_, res) =>
  res
    .status(200)
    .send("Welcome to Chainstarts Full-stack Test App ** Backend **")
);

export default router;
