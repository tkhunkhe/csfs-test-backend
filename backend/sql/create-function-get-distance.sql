Use csfs_test;
DELIMITER $$
DROP FUNCTION IF EXISTS getDistance$$
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

SHOW function STATUS;

-- SELECT getDistance(45.52620376386212, -122.632808881233, 45.50386133706128,-122.6656688117572);