<?php

	require_once './db_connection.php';
	require_once './functions.php';

	global $link;

	// $query = "select * from stations order by station_id limit 100";
	$query = "select * from stations order by station_id";
	$result = mysqli_query($link, $query);
	$data = array();

	while ($row = mysqli_fetch_assoc($result)) {
		$key = $row['station_id'];
		$data[$key] = $row;
	}
	echo json_encode($data);

	if (!$result) {
		echo mysqli_error($link);
	} else {
		// echo 'GOOD QUERY!';
	}

	mysqli_close($link);
?>