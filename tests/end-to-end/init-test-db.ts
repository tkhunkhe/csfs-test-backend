// read json and add to db
import readMocked from "../mocked-data/read-mocked-data";
import userServ from "../../src/services/user";
import locationServ from "../../src/services/location";
import checkpointServ from "../../src/services/checkpoint";
import distanceServ from "../../src/services/distance";
import prisma from "../../src/connectors/prisma-client";
import { Prisma } from "@prisma/client";
import pointsServ from "../../src/services/points";

const clearDB = async () => {
  const execute = async (prepQueries) => {
    const prepQueriesPromises = prepQueries.map((qry) =>
      prisma.$executeRaw(Prisma.sql([qry]))
    );
    for (const qry of prepQueriesPromises) {
      await qry;
    }
  };
  try {
    const tablenames = await prisma
      .$queryRaw<{ tableName: string }[]>(
        Prisma.sql`select table_name as tableName
          from information_schema.tables
          where table_type = 'BASE TABLE'
                  and table_schema = 'csfs_test' and table_name <> '_prisma_migrations'
          order by table_name;`
      )
      .then((data: any[]) => data.map((item) => item.tableName));
    let prepQueries = tablenames.map((name) => `DELETE FROM \`${name}\`;`);
    await execute(prepQueries);
    prepQueries = tablenames.map(
      (name) => `ALTER TABLE ${name} AUTO_INCREMENT = 1;`
    );
    await execute(prepQueries);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

const initUsers = async (users: any[]) => {
  const promises = users.map((user) => {
    return userServ.createUser(user);
  });
  return await Promise.all(promises);
};

const initUserLocations = async (userLocs: any[]) => {
  const flattenLocs = userLocs.reduce((acc, userItem) => {
    return acc.concat(
      userItem.locs.map((loc) => ({ ...loc, userId: userItem.userId }))
    );
  }, []);
  return await locationServ.createLocations(flattenLocs);
};

const initCheckpoints = async (checkpoints: any[]) => {
  return await checkpointServ.createCheckpoints(checkpoints);
};

const calDistances = async () => {
  return await distanceServ.calculateAndStoreCurrentDistances();
};

const calPoints = async () => {
  return await pointsServ.calculateAndStorePointsForAllUsers();
};

const main = async () => {
  await clearDB();
  const mocked = await readMocked.read();
  //   console.log(mocked);
  await initUsers(mocked.users);
  await initCheckpoints(mocked.checkpoints);
  await initUserLocations(mocked.userLocs);
  await calDistances();
  await calPoints();
};

export default main;
