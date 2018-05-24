<?php
	$table = $_POST['table'].'Markers';
	$col = $_POST['col'];
	$data = $_POST['data'];
	
	require 'openMysql.php';
	
	$query = $sql->prepare('INSERT INTO '.$table' ('.$col.') VALUE (?)');
	$query->execute(array($data));
	
	$sql = null;
?>