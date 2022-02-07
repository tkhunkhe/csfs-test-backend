import latlongUtil from "src/utils/latlong-util";
import prisma from "../connectors/prisma-client";
import addressServ from "./address";

const createUser = async (user: {
  username: string;
  address: string;
  lat?: number;
  long?: number;
  id?: number;
  createdAt?: any;
}) => {
  let data = user;
  if (!data.lat || !data.long) {
    console.log(
      `no lat or long so calling API to find out the lat-long of the address`
    );
    try {
      const latLong = await addressServ.getLatLongForAddress(data.address);
      data = { ...data, ...latLong };
    } catch (err) {
      console.error(
        `couldn't find lat long for address ${data.address} so will leave lat long empty`
      );
    }
  }
  return prisma.user.create({
    data,
  });
};

const getUser = (userId: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

const getAllUsers = () => {
  return prisma.user.findMany({});
};

export default {
  getUser,
  createUser,
  getAllUsers,
};
