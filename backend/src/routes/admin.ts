import express from "express";
import userController from "../controllers/user";
const router = express.Router();
router.post("/user/add", userController.addUser);
// NOTE: can add in the future
router.post("/user/home/change", (req, res) => res.send("under contruction"));
// TODO:
router.post("/checkpoints/add", (req, res) => res.send("hi"));
// TODO:
router.post("/checkpoints/remove", (req, res) => res.send("hi"));
export default router;
