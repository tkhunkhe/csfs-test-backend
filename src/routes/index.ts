import express from "express";
import dashboard from "./dashboard";
import bodyParser from "body-parser";
import cors from "cors";

const router = express.Router();
router.use(cors()); // NOTE: should use cors only for dev sites
const jsonParser = bodyParser.json({ limit: "5mb" });
router.use(jsonParser);
router.get("/", (_, res) =>
  res
    .status(200)
    .send("Welcome to Full-stack Test App ** Backend **")
);
router.use("/dashboard", dashboard);

export default router;
