<?php
	$variable = $_POST['variable'];
	
	require 'openMysql.php';
	
	$query = $sql->prepare('INSERT INTO marker VALUE (?)');
	$query->execute(array($variable));
	
	$sql = null;
?>