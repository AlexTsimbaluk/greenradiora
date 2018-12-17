<?php

header("Content-Type: text/html; charset=utf-8");
mb_internal_encoding("UTF-8");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');


if($_SERVER['HTTP_REFERER'] === "http://vuea.radiora.ru") {
	echo 'ref' . $_SERVER['HTTP_REFERER'];
} elseif($_SERVER['HTTP_REFERER'] === "http://localhost:8080/") {
	echo 'ref' . $_SERVER['HTTP_REFERER'];
}

// var_dump($_POST);
// var_dump($_GET);

if ($_GET['name'] == 'testGET') {
	echo 'GET принят::' . $_GET['name'] . '::' . $_SERVER['HTTP_ORIGIN'] . '::' . $_SERVER['HTTP_REFERER'];
}

?>