import prisma from "../../src/connectors/prisma-client";
import pointsHistoryServ from "../../src/services/points-history";
import { Prisma } from "@prisma/client";

/**
 * got This command is not supported in the prepared statement protocol yet
 */
const createGetDistanceFunction = () => {
  return prisma.$executeRaw`
  DELIMITER $$
  DROP FUNCTION IF EXISTS getDistance $$
  CREATE FUNCTION getDistance(lat1 float, lng1 float, lat2 float, lng2 float)
  RETURNS float DETERMINISTIC
  BEGIN
      declare distance float;
      set distance = (select (6371 * acos( 
                      cos( radians(lat2) ) 
                    * cos( radians( lat1 ) ) 
                    * cos( radians( lng1 ) - radians(lng2) ) 
                    + sin( radians(lat2) ) 
                    * sin( radians( lat1 ) )
                      ) ) as distance);
      return distance;
  END$$
  DELIMITER ;
`;
};
/**
 * got This command is not supported in the prepared statement protocol yet
 */
const createCalculatePointsHistory = () => {
  return prisma.$executeRaw`
        DELIMITER $$ 
        DROP PROCEDURE IF Exists calculatePointsHistory$$ CREATE PROCEDURE calculatePointsHistory() BEGIN
        INSERT
            IGNORE
        INTO
            ULocDPointsHistory(uLocId,
            dPointsId)
        SELECT
            uLocId,
            dpId
        FROM
            ( with cpMatched as (
            SELECT
                c.id as cpId,
                userId,
                ul.id as uLocId,
                getDistance(ul.lat,
                ul.\`long\`,
                c.lat,
                c.\`long\`) as dist,
                ul.createdAt as uLocCreatedAt
            from
                UserLocation ul,
                Checkpoint c
            where
                c.createdAt <= ul.createdAt
                -- cp created before location created

                having dist <= 0.025),
            selectedDist as (
            select
                cm.uLocId,
                cm.uLocCreatedAt,
                d.*
            from
                cpMatched cm
            join Distance d on
                cm.cpId = d.cpId
                and cm.userId = d.userId),
            selectedDPs as (
            select
                sd.uLocId,
                sd.cpId,
                sd.userId,
                sd.uLocCreatedAt,
                dp.id as dpId,
                dp.points,
                dp.distPointsSetId as dpsId
            from
                selectedDist sd
            join DistancePoints dp on
                sd.id = dp.distId),
            withDps as (
            select
                sdp.*,
                dps.createdAt as dpsCreatedAt
            from
                selectedDps sdp
            join DistancePointsSet dps on
                sdp.dpsId = dps.id
            having
                sdp.uLocCreatedAt >= dpsCreatedAt ),
            withRn as (
            select
                *,
                ROW_NUMBER() over (partition by uLocId
            order by
                dpsCreatedAt desc) as rn
            from
                withDps),
            results as (
            select
                *
            from
                withRn
            where
                rn = 1)
            select
                *
            from
                results) alias; END$$;
        DELIMITER ;
  `;
};
/**
 * got This command is not supported in the prepared statement protocol yet
 */
const createCalculatePastPointsAndRank = () => {
  return prisma.$executeRaw`
    DELIMITER $$
    DROP PROCEDURE IF Exists calculatePastPointsAndRank $$
    create procedure calculatePastPointsAndRank() BEGIN BEGIN CREATE TEMPORARY TABLE IF NOT EXISTS temp( userId INT UNSIGNED,
    uLocCreatedAt DateTime,
    cumPoints Int,
    \`rank\` Int) ENGINE = MEMORY;
    Insert
        into
        temp
    select
        *
    from
        ( with uLocHist as (
        SELECT
            udh.*,
            ul.userId,
            ul.createdAt
        FROM
            ULocDPointsHistory udh
        join UserLocation ul ON
            udh.uLocId = ul.id ),
        pointsHist as (
        select
            ulh.id as poinstHistId,
            ulh.uLocId,
            ulh.dPointsId,
            ulh.userId,
            ulh.createdAt as uLocCreatedAt,
            dp.points
        from
            uLocHist ulh
        join DistancePoints dp on
            ulh.dPointsId = dp.id ),
        tCumPoints as (
        select
            userId,
            uLocCreatedAt,
            sum(points) over (partition by userId
        order by
            uLocCreatedAt) as cumPoints
        from
            pointsHist),
        tRanks as (
        select
            *,
            DENSE_RANK() OVER(PARTITION BY uLocCreatedAt
        ORDER BY
            cumPoints DESC) as \`rank\`
        from
            tCumPoints)
        select
            *
        from
            tRanks) alias;
    END;
    -- insert into RankSet
    BEGIN
    INSERT
        IGNORE
    INTO
        RankSet(createdAt)
    SELECT
        distinct uLocCreatedAt
    from
        temp;
    END; COMMIT;
    -- insert into RankHistory
    BEGIN
    INSERT
        IGNORE
    INTO
        RankHistory(userId,
        \`rank\`,
        totalPoints,
        rankSetId)
    SELECT
        temp.userId,
        temp.\`rank\`,
        temp.cumPoints,
        rs.id
    from
        temp
    join RankSet rs on
        rs.createdAt = temp.uLocCreatedAt;
    END; COMMIT; BEGIN DROP TABLE temp;
    END; END$$
    DELIMITER ;
  `;
};

const main = async () => {
  /**
   * running create function and procedures with prisma invoke error
   * "got This command is not supported in the prepared statement protocol yet"
   * so have to run manually in sql
   */
  //   await createGetDistanceFunction();
  //   await createCalculatePointsHistory();
  //   await createCalculatePastPointsAndRank();
  await pointsHistoryServ.callCalculateAllHistory();
};
export default main;
