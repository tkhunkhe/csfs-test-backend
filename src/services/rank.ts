import prisma from "../connectors/prisma-client";

/**
 * helper function
 * @params assuming rankSets are sorted ascending
 * @returns {userId: change}
 */
const getUserIdToChangeDirection = <
  T extends { rankHists: { rank: number; user: { id: number } }[] }
>(
  rankSets: T[]
): { [userId: number]: number } => {
  if (rankSets.length < 1) throw Error("rankSets must have at least length 1");
  const hasPrevs = rankSets.length > 1;
  let prevObj = {};
  if (hasPrevs) {
    prevObj = rankSets[1].rankHists.reduce(
      (acc, rh) => ({ ...acc, [rh.user.id]: rh.rank }),
      {}
    );
  }
  return rankSets[0].rankHists.reduce(
    (acc, rh) => ({
      ...acc,
      [rh.user.id]: rh.rank - (prevObj[rh.user.id] ?? 0),
    }),
    {}
  );
};
/**
 * for /dashboard/ranks
 */
const getLatestRankSetRanks = async () => {
  const rankSets = await prisma.rankSet.findMany({
    take: 2,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      rankHists: {
        select: {
          id: true,
          rank: true,
          totalPoints: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
  if (rankSets.length < 1) return null;
  const userIdToChange = getUserIdToChangeDirection(rankSets);
  const firstRS = rankSets[0];

  const rankHists = firstRS.rankHists.map((rk) => ({
    ...rk,
    change: userIdToChange[rk.user.id],
  }));
  return {
    ...firstRS,
    rankHists,
  };
};

export default {
  getLatestRankSetRanks,
};
