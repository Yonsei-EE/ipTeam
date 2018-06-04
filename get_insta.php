<?php 

		error_reporting( E_ALL );
		ini_set('display_errors', 1);

		require 'vendor/autoload.php';
		use GuzzleHttp\Client;

		echo parse_str($_SERVER['QUERY_STRING'], $vars);
		$latitude =  $vars['lat'];
		$longitude =  $vars['lng'];

		$client = new \GuzzleHttp\Client();
		$response = $client->request('GET', 'https://api.instagram.com/v1/media/search', [
			'query' => ['lat' => $latitude, 'lng' => $longitude,
			'access_token' => '7767454861.f70ce12.888f320125da4d6a823a27fce08aa7c7',
		  'distance' => '5000']
		]);

		echo $response->getBody();
?> 

