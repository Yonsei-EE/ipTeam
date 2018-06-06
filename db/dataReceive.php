<?php
	$table = $_GET['table'].'Markers';
	$col = $_GET['col'];
	$col2 = $_GET['col2'];

	require 'openMysql.php';
	
	$sql = open();
	
	$query = $sql->prepare('SELECT '.$col.', '.$col2.' from '.$table);
	$query->execute();

	$data = $query->fetchAll(PDO::FETCH_NUM);
	
	$sql = null;

	echo json_encode($data);
?>
