<?php
	$table = $_POST['table'].'Markers';
	$col = $_POST['col'];
	$data = $_POST['data'];
	
	$Lat = $data['Lat'];
	$Lng = $data['Lng'];
	$id = $data['id'];
	$pw = $data['pw'];

	require 'openMysql.php';
	
	$sql = open();

	$query = $sql->prepare('DELETE FROM ipproject.'.$table.' where json_extract('.$col.', '."'$.Lat'".') - :Lat < 0.00000000001 && json_extract('.$col.', '."'$.Lng'".') - :Lng < 0.00000000001 && json_extract('.$col.', '."'$.id'".') = :id && json_extract('.$col.', '."'$.pw'".') = :pw');
	$query->bindParam(':Lat', $Lat);
	$query->bindParam(':Lng', $Lng);
	$query->bindParam(':id', $id);
	$query->bindParam(':pw', $pw);

	$query->execute();

	$sql = null;
?>
