<?php

error_reporting( E_ALL );
ini_set('display_errors', 1);
require_once('instagram-login-api.php');

/* Instagram App Client Id */
define('INSTAGRAM_CLIENT_ID', 'f70ce127369142d4be12655a99e7f35e');
/* Instagram App Client Secret */
define('INSTAGRAM_CLIENT_SECRET', '4b289cff35b04765800852e9780b6c54');
/* Instagram App Redirect Url */
define('INSTAGRAM_REDIRECT_URI', 'https://ipteam.ga/working/instagram-dev/index.php');


$login_url = 'https://www.instagram.com/oauth/authorize/?client_id=' . INSTAGRAM_CLIENT_ID . '&redirect_uri=' . urlencode(INSTAGRAM_REDIRECT_URI) . '&response_type=code&scope='. urlencode('basic public_content');

$access_token = NULL;

session_start();



$_SESSION['logged_in'] = 0;
$_SESSION['token'] = '';
// Instagram passes a parameter 'code' in the Redirect Url
if(isset($_GET['code'])) {
  try {
    $instagram_ob = new InstagramApi();

    // Get the access token
    $access_token = $instagram_ob->GetAccessToken(INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI, INSTAGRAM_CLIENT_SECRET, $_GET['code']);

    // Get user information
    $user_info = $instagram_ob->GetUserProfileInfo($access_token);

    //echo '<pre>';print_r($user_info); echo '</pre>';

    // Now that the user is logged in you may want to start some session variables
		$_SESSION['logged_in'] = 1;
		$_SESSION['token'] = $access_token;

  }
  catch(Exception $e) {
    echo $e->getMessage();
    exit;
  }
}

?>


<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<script>
			var instatoken ='';
			instatoken = '<?= $_SESSION['token']; ?>'; 
	</script>
	<meta charset="utf-8">
	<meta name="viewport" content="user-scalable=no, initial-scale=0.6, maximum-scale=1.0, minimum-scale=0.5, width=device-width">
	<title>Test Map</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<link rel="stylesheet" href="style.css" type="text/css">
	<!--<script type="text/javascript" src="//dapi.kakao:q.com/v2/maps/sdk.js?appkey=0a251234a41a2bd0ec1c296f3f1cf04b"></script>-->
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=3d99118be6f66b213e232f75ada21ada"></script>
	<script type="text/javascript" src="daumApi.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="slick/slick.css"/>
	<link rel="stylesheet" type="text/css" href="slick/slick-theme.css"/>
</head>
<body>
<div class="container-fluid">
		<div class="row" style="height:100%">
				<div class="col-lg-2 col-md-2 col-sm-3 col-xs-3">
					<div class="container-fluid">
						<div class="row">
							<div class="category" onclick="changeMarker('skate')">
								<div id="skateMenu" class="menu"></div>
							</div>
						</div>
						<div class="row">
							<div class="category" onclick="changeMarker('basket')">
								<div id="basketMenu" class="menu"></div>
							</div>
						</div>
						<div class="row">
							<div class="category" onclick="changeMarker('fish')">
								<div id="fishMenu" class="menu"></div>
							</div>
						</div>
						<div class="row">
							<div class="category" onclick="changeMarker('all')">
							  	<div id="allMenu" class="menu menu_selected"></div>
							</div>
						</div>
						<div class="row">
							<div class="button">
								<button id="setMarker" class="btn btn-default btn-block" type="button">중앙마커</button>
							</div>
						</div>
						<div class="row">
							<div class="button">
								<button id="setGeolocation" class="btn btn-default btn-block" type="button">내위치</button>
							</div>
						</div>
						<div class="row">
							<div class="button">
								<button id="setArea" class="btn btn-default btn-block" type="button">장소설정</button>
								<button id="createPolyline" class="btn btn-default btn-block" type="button">확인</button>
							</div>
						</div>
						<div class="row">
							<div class="button">
								<button id="insta_button" class="btn btn-default btn-block" type="button">Instagram</button>
							</div>
						</div>
						<div class="row instalogin">
							<?php
								if ($_SESSION['logged_in'] == 0){
									echo "<a href={$login_url}> <img src=\"images/insta_signin.png\" /> </a>";
								}
								else{


								echo "<div class=\"col \"><img style=\"width=\"64\" class='img-thumbnail' src=\"{$user_info["profile_picture"]}\" </div>"; 
								echo "<div class=\"col-2 small\">{$user_info["username"]} </div>"; 

								
								}	
?>

						</div>

					</div>
				</div>
				<div class="col-lg-10 col-md-10 col-sm-9 col-xs-9">
					<div id="map" style="width:100%;height:100%;"></div>
					<div id="info" style="width:100%;height:0%;"></div>
					<div id="insta" style="display:none; width:100%; max-width:640px;">
							<div id="insta-photo" class ="insta-photo">
							<div id="instatemplate" class="border rounded h6">
								<div class="row" style="vertical-align:middle;">
									<div id="insta_user"  class="col-sm" style="vertical-align:middle;">
										<img width="64" align="left" class='img-thumbnail' src="images/insta_pin.png" />
									</div>
									<div id="likes" class="text-right float-right col-sm">
										<img width="32" align="right" src="images/insta_like.jpg" />
									</div>
								</div>
								<div class="row" style="box-shadow:none;">
									<div id="instaimg" class="col-sm" align="center"></div>
								</div>
								<div class="row small">
										<div id="insta_location"  class="small col-8">
										<img width="48" align="left" src="images/insta_location.png" />
										<span style="position:relative; top: 5px; font-size: 0.65em; font-style: italic;">
										 맵 표시
										</span>
										</div>
										<div id="instalink"  style="top:5px;" class="small float-right col">
										<a id="proflink" href="http://www.instagram.com" target="_blank">
											<button type="button" style="padding:3px;" class="btn-xs rounded btn-light">Insta Link</button>
										</a>
										</div>
								</div>
								</div>
							</div>
								<div id="insta-slide" style="margin-top:5px; padding: 5px;" class="insta-slide border rounded"></div>
							
					</div>
				</div>
		</div>
</div>


<script type="text/javascript" src="./db/jsForDB.js"></script>
<script type="text/javascript" src="mainControl.js"></script>
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="slick/slick.min.js"></script>
<script type="text/javascript" src="insta.js"></script>
</body>
</html>
