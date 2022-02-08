use csfs_test;
DELIMITER $$ 
DROP PROCEDURE IF Exists calculatePointsHistory $$
CREATE PROCEDURE calculatePointsHistory()
BEGIN
INSERT IGNORE INTO ULocDPointsHistory(uLocId, dPointsId)
SELECT uLocId, dpId FROM (
	with cpMatched as (
SELECT
	c.id as cpId,
	userId,
	ul.id as uLocId,
	getDistance(ul.lat,
	ul.`long`,
	c.lat,
	c.`long`) as dist,
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
	withDps), results as (
select
	*
from
	withRn
where
	rn = 1) select * from results) alias;
END$$;
DELIMITER ;
-- CALL calculatePointsHistory();