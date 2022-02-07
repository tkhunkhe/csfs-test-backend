import userServ from "../services/user";
const addUser = (req, res) => {
  // NOTE: can add validate input in the future
  userServ.createUser(req.username, req.address);
  return res.status(200);
};

export default {
  addUser,
};
