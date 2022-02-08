import express from "express";
import dashboard from "./dashboard";
import bodyParser from "body-parser";

const router = express.Router();
const jsonParser = bodyParser.json({ limit: "5mb" });
router.use(jsonParser);
router.get("/", (_, res) =>
  res
    .status(200)
    .send("Welcome to Chainstarts Full-stack Test App ** Backend **")
);
router.use("/dashboard", dashboard);

export default router;
