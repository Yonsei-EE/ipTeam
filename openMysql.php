<?php
	function open() {
		try {
			// MySQL PDO 객체 생성
			// mysql을 다른 DB로 변경하면 다른 DB도 사용 가능
			$sql = new PDO("mysql:host=localhost;dbname=ipproject", 'root', 'ipteam');

			// 에러 출력
			$sql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}

		catch(Exception $e) {
			echo $e->getMessage();
		}
		
		return $sql;
	}
?>