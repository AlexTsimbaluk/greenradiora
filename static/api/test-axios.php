<?php

header("Content-Type: text/html; charset=utf-8");
mb_internal_encoding("UTF-8");

/*if ($_POST['name'] == 'testPOST') {
	echo 'GET принят::' . $_POST['name'] . ' ';
}*/

if(isset($_POST['name']))
    echo $_POST['name'];

// var_dump($_POST);
// var_dump($_GET);

if ($_GET['name'] == 'testGET') {
	echo 'GET принят::' . $_GET['name'] . ' ';
}

?>