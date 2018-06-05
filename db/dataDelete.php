<?php
	$table = $_POST['table'].'Markers';
	$col = $_POST['col'];
	$Lat = $_POST['Lat'];
	$Lng = $_POST['Lng'];

	require 'openMysql.php';
	
	$sql = open();

	$query = $sql->prepare('DELETE FROM ipproject.'.$table.' where json_extract('.$col.', '."'$.Lat'".') - :Lat < 0.00000000001 && json_extract('.$col.', '."'$.Lng'".') - :Lng < 0.00000000001');
	$query->bindParam(':Lat', $Lat);
	$query->bindParam(':Lng', $Lng);

	$query->execute();

	$sql = null;
?>
