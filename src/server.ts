import express from "express";
import router from "./routes";

const app = express();
const port = 4000;

const server = app.listen(port, () => {
  app.use(router);
  console.log(
    `Checkpoints Tracking app (full-stack test) is running on port ${port}.`
  );
});

export default server;
