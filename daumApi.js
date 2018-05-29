function map_initialize() {
	var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
	var options = { 
		center: new daum.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
		level: 3 //지도의 레벨(확대, 축소 정도)
	};

	var map = new daum.maps.Map(container, options); //지도 생성 및 객체 리턴

	// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
	var mapTypeControl = new daum.maps.MapTypeControl();
	map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

	// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
	var zoomControl = new daum.maps.ZoomControl();
	map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

	// 지도에 교통정보를 표시하도록 지도타입을 추가합니다
	// map.addOverlayMapTypeId(daum.maps.MapTypeId.TRAFFIC);

	return map;
}

function geoLocation() {
	if(navigator.geolocation)
			navigator.geolocation.getCurrentPosition(showPosition, showError);
	else {
			alert("Geolocation is not supported by this browser.");
			tryAPIGeolocation();
	}
}

function showPosition(position) {
	myLat = position.coords.latitude;
	myLng = position.coords.longitude;
	console.log("myLat : " + myLat);
	console.log("myLng : " + myLng);

	map.panTo(new daum.maps.LatLng(myLat, myLng));
}

function showError(error) {
	switch (error.code)
	{
		case error.PERMISSION_DENIED:
			alert("User denied the request for Geolocation. Trying Google Geoloction API.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Location information is unavailable. Trying Google Geoloction API.");
			break;
		case error.TIMEOUT:
			alert("The request to get user location timed out. Trying Google Geoloction API.");
			break;
		case error.UNKNOWN_ERROR:
			alert("An unknown error occured. Trying Google Geoloction API.");
			break;
	}
	tryAPIGeolocation();
}

function tryAPIGeolocation() {
		var wifis = '{"considerIp": "true"}';//,' +
			//'"homeMobileCountryCode: 450, "homeMobileNetworkCode": 05, "radioType": "wcdma", "carrier": "SKTelecom"' +
			//'"cellTowers":[{"cellId": 21532831, "locationAreaCode": 2862, "mobileCountryCode": 214, "mobileNetworkCode": 7}],' +
			//'"wifiAccessPoints": [{"macAddress": "00:25:9c:cf:1c:ac","signalStrength": -45, "age": 0, "signalToNoiseRatio": 40},' +
			//		'{"macAddress": "00:25:9c:cf:1c:ad","signalStrength": -60,"age": 0,"signalToNoiseRatio": 0}]}';
	$.ajax({
		type: 'post',
		dataType: 'json',
		contentType: 'application/json',
		url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDBgM2DyWYhkCnWCo0GS9RWFhfoebbSCug',
		data: wifis,
		success: function (response) {
			apiGeolocationSuccess({coords: {latitude: response.location.lat, longitude: response.location.lng}});
		},
		error: function (err) {
			alert("API Geolocation error! \n\n"+err);
		}
	});
}

function apiGeolocationSuccess(position) {
	console.log("myLat : " + position.coords.latitude);
	console.log("myLng : " + position.coords.longitude);
	map.setCenter(new daum.maps.LatLng(position.coords.latitude, position.coords.longitude));
}

function addMarker(position, iwContent) {
	if(type == 'all') {
		alert("Please specify marker category.");
		return;
	}

	var marker = new daum.maps.Marker({
		position: position,
		clickable: true,
	});

	marker.setDraggable(true);

	// 인포윈도우를 생성합니다
	var myInfowindow = new daum.maps.InfoWindow({
		position : position,
		content : iwContent 
	});

	daum.maps.event.addListener(marker, 'mouseover', function() {
		myInfowindow.open(map, marker);  
	});
	daum.maps.event.addListener(marker, 'mouseout', function() {
		myInfowindow.close();
	});
	daum.maps.event.addListener(marker, 'dragstart', function() {
		myInfowindow.close();
	});
	daum.maps.event.addListener(marker, 'dragend', function() {
		myInfowindow.open(map, marker);
	});

	daum.maps.event.addListener(marker, 'click', function() {
		window.location.href = "https://www.naver.com";
	});

	daum.maps.event.addListener(marker, 'rightclick', function() {
		myInfowindow.close();
		marker.setMap(null);
	});
	
	var skateMenu = document.getElementById('skateMenu');
	var basketMenu = document.getElementById('basketMenu');
	var fishingMenu = document.getElementById('fishingMenu');
				
	// 커피숍 카테고리가 클릭됐을 때
	if (type === 'skate') {
	
              var imageSrc1 = 'images/Icon_Skateboard(150x150).png', // 마커이미지의 주소입니다    
              imageSize1 = new daum.maps.Size(22, 24), // 마커이미지의 크기입니다
             // imageOption1 = {offset: new daum.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
              imageOption1 = { 
		center: new daum.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
		level: 3 //지도의 레벨(확대, 축소 정도)
	};
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
              var markerImage1 = new daum.maps.MarkerImage(imageSrc1, imageSize1, imageOption1),
              markerPosition1 = marker.getPosition();// 마커가 표시될 위치입니다

    // 마커를 생성합니다
              var marker1 = new daum.maps.Marker({
                  position: markerPosition1, 
                  image: markerImage1 // 마커이미지 설정 
              });
	
		skateMarkers.push(marker1);
		marker1.setMap(map);
	
	
	
	} else if (type === 'basket') { // 편의점 카테고리가 클릭됐을 때
		
		
               var imageSrc2 = 'images/Icon_Basketball(150x150).png', // 마커이미지의 주소입니다    
               imageSize2 = new daum.maps.Size(22, 24), // 마커이미지의 크기입니다
               imageOption2 = { // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
		center: new daum.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
		level: 3 //지도의 레벨(확대, 축소 정도)
	};
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
               var markerImage2 = new daum.maps.MarkerImage(imageSrc2, imageSize2, imageOption2),
               markerPosition2 = marker.getPosition();// 마커가 표시될 위치입니다

    // 마커를 생성합니다
               var marker2 = new daum.maps.Marker({
               position: markerPosition2, 
               image: markerImage2 // 마커이미지 설정 
});
	
	       basketMarkers.push(marker2);
	       marker2.setMap(map);
		
		
	}else if(type === 'fishing') { // 편의점 카테고리가 클릭됐을 때
		
		
    var imageSrc3 = 'images/Icon_Fishing(150x150).png', // 마커이미지의 주소입니다    
    imageSize3 = new daum.maps.Size(22, 24), // 마커이미지의 크기입니다
    imageOption3 = {        // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
		center: new daum.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
		level: 3 //지도의 레벨(확대, 축소 정도)
	}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage3 = new daum.maps.MarkerImage(imageSrc3, imageSize3, imageOption3),
    markerPosition3 = marker.getPosition();// 마커가 표시될 위치입니다

    // 마커를 생성합니다
    var marker3 = new daum.maps.Marker({
    position: markerPosition3, 
    image: markerImage3 // 마커이미지 설정 
});
	
		
		
		
		fishingMarkers.push(marker3);
		marker3.setMap(map);
	}

	var jsonText = JSON.stringify(marker.getPosition());
	$.post('dataSend.php', {col: 'position', table: type, data: jsonText});
}

function changeMarker(changetype){
	var skateMenu = document.getElementById('skateMenu');
	var basketMenu = document.getElementById('basketMenu');
	var fishingMenu = document.getElementById('fishingMenu');
	var allMenu = document.getElementById('allMenu');
				
	// 커피숍 카테고리가 클릭됐을 때
	if (changetype === 'skate') {
								
		// 커피숍 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = 'menu_selected';
		basketMenu.className = '';
		fishingMenu.className = '';
		allMenu.className = '';

		// 커피숍 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(map);
		setBasketMarkers(null);
		setFishingMarkers(null);
	} 
	else if (changetype === 'basket') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = '';
		basketMenu.className = 'menu_selected';
		fishingMenu.className = '';
		allMenu.className = '';
																														
		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(null);
		setBasketMarkers(map);
		setFishingMarkers(null);
		
	}else if (changetype === 'fishing'){
		
		skateMenu.className = '';
		basketMenu.className = '';
		fishingMenu.className = 'menu_selected';
		allMenu.className = '';
		
		setSkateMarkers(null);
		setBasketMarkers(null);
		setFishingMarkers(map);
		
	

        }else if (changetype === 'all') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = '';
		basketMenu.className = '';
		fishingMenu.className = '';
		allMenu.className = 'menu_selected';
																														
		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(map);
		setBasketMarkers(map);
		setFishingMarkers(map);
	}

	type = changetype;
}

function setSkateMarkers(map) {        
	for (var i = 0; i < skateMarkers.length; i++) {  
		skateMarkers[i].setMap(map);
	}        
}

function setBasketMarkers(map) {        
	for (var i = 0; i < basketMarkers.length; i++) {  
		basketMarkers[i].setMap(map);
	}        
}
function setFishingMarkers(map) {        
	for (var i = 0; i < fishingMarkers.length; i++) {  
		fishingMarkers[i].setMap(map);
	}        
}

function loadMarkers(type, markerset) {
	$.ajax({
		method:"GET", url:"dataReceive.php", async:false,
		data:{col: 'position', table: type},
		success:
			function (data, status) {
				lDO = JSON.parse(data);
				for (num in lDO) {
					var temp =  new daum.maps.Marker({
						position: JSON.parse(lDO[num]),
						clickable: true,
					});
					markerset.push(temp);
				}
			}
	});
}
