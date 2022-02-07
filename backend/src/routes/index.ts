import express from "express";
import dashboard from "./dashboard";
import admin from "./admin";
import mobile from "./mobile";
import bodyParser from "body-parser";

const router = express.Router();
const jsonParser = bodyParser.json({ limit: "5mb" });
router.use(jsonParser);
router.get("/", (_, res) =>
  res
    .status(200)
    .send("Welcome to Chainstarts Full-stack Test App ** Backend **")
);
router.use("dashboard", dashboard);
router.use("admin", admin);
router.use("mobile", mobile);

export default router;
