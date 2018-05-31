<?php

	$table = $_GET['table'].'Markers';
	$col = $_GET['col'];

	require 'openMysql.php';
	
	$sql = open();

	$query = $sql->prepare('SELECT '.$col.' from '.$table);
	$query->execute();

	$data = $query->fetchAll(PDO::FETCH_COLUMN);

	$sql = null;

	echo json_encode($data);
?>
