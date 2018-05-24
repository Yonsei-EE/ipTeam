<?php
	require 'openMysql.php';
	
	function getData($table, $col) {
		$sql = open();
		
		$table = $table + 'Markers';
	
		$query = $sql->prepare('SELECT $col from $table');
		$query->execute();
	
		//$query->setFetchMode(PDO::FETCH_ASSOC);
	
		$data = $query->fetchAll();
	
	 	print_r($data);

		$sql = null;

		return $data;
	}
?>
