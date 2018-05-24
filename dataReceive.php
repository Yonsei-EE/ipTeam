<?php
	require 'openMysql.php';
	
	$sql = open();
	
	$query = $sql->prepare('SELECT * from marker');
	$query->execute();
	
	$query->setFetchMode(PDO::FETCH_ASSOC);
	
	while($row = $query->fetch()) {
		echo$row['position'].'<br/>';
	}
	$sql = null;
?>