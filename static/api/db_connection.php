<?php

session_start();

header("Content-Type: text/html; charset=utf-8");
mb_internal_encoding("UTF-8");

/*if($_SERVER['HTTP_REFERER'] == "http://vuea.radiora.ru/"
	|| $_SERVER['HTTP_REFERER'] == "http://greenra/"
	|| $_SERVER['HTTP_REFERER'] == "http://localhost:8000/index.html"
	|| $_SERVER['HTTP_REFERER'] == "http://localhost:8000/"
	|| $_SERVER['HTTP_REFERER'] == "http://localhost:8080/") {
	// For remote server
	$host = "localhost";
	$user = "radiorar";
	$password = "39at6F6dEp";
	// $database = "vuearadiora";
	$database = "radiora";
} else {
	// For home
	$host = "localhost";
	$user = "root";
	$password = "9";
	$database = "radio_ra";
}*/

$host = "localhost";
$user = "radiorar";
$password = "39at6F6dEp";
$database = "radiora";

$link = mysqli_connect($host, $user, $password, $database);
if(!$link) {
	echo 'Ошибка подключения к MySQL<br>';
	echo mysqli_error();
	exit();
} else {
	// echo 'Connect to MySQL<br>';
}


mysqli_set_charset($link, 'utf8');

if(!mysqli_select_db($link, $database)) {
	echo 'Ошибка доступа подключения к базе данных ' . $database . '<br>';
	exit();
} else {
	// echo 'Connect to DB<br>';
}

// session_start();

?>
