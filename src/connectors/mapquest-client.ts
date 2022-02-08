import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const mapquest = axios.create({
  baseURL: `http://www.mapquestapi.com/geocoding/v1`,
  params: {
    key: process.env.MAPQUEST_KEY,
  },
});

export default mapquest;
