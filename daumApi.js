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

	currentLocation = new daum.maps.LatLng(myLat, myLng);
	if(startup) {
		map.panTo(currentLocation);
		startup = false;
	}
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
	currentLocation = new daum.maps.LatLng(position.coords.latitude, position.coords.longitude);
}

function addMarker(position, iwContent, currentType) {
	if(type == 'all') {
		//alert("Please specify marker category.");
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
		clearInterval(interval);
	});

	//var skateMenu = document.getElementById('skateMenu');
	//var basketMenu = document.getElementById('basketMenu');

	// 커피숍 카테고리가 클릭됐을 때
	if (currentType === 'skate') {
		/*
		var markerImage = new daum.maps.MarkerImage(
			'images/marker.png',
			new daum.maps.Size(512, 512),
			{
				offset: new daum.maps.Point(256,510),
				alt: "Marker Image",
				shape: "poly",
				coords: "60,193,60,217,62,165,70,133,84,104,103,76,125,51,146,34,169,21,191,12,213,6,234,1,252,1,268,0,292,3,319,11,343,21,366,35,387,50,405,70,420,88,432,109,443,133,449,156,452,184,453,207,449,239,438,271,418,311,429,293,401,336,379,366,356,392,329,424,306,452,289,471,270,496,257,511,242,494,222,469,200,442,174,412,145,380,123,355,100,321,83,293,71,262,64,239"
			}
		);

		marker.image = markerImage;
		*/
		skateMarkers.push(marker);
		marker.setMap(map);
	}
	else if (currentType === 'basket') { // 편의점 카테고리가 클릭됐을 때
		/*
		var markerImage = new daum.maps.MarkerImage(
			'images/marker.png',
			new daum.maps.Size(512, 512),
			{
				offset: new daum.maps.Point(256,510),
				alt: "Marker Image",
				shape: "poly",
				coords: "60,193,60,217,62,165,70,133,84,104,103,76,125,51,146,34,169,21,191,12,213,6,234,1,252,1,268,0,292,3,319,11,343,21,366,35,387,50,405,70,420,88,432,109,443,133,449,156,452,184,453,207,449,239,438,271,418,311,429,293,401,336,379,366,356,392,329,424,306,452,289,471,270,496,257,511,242,494,222,469,200,442,174,412,145,380,123,355,100,321,83,293,71,262,64,239"
			}
		);

		marker.image = markerImage;
		*/
		basketMarkers.push(marker);
		marker.setMap(map);
	}
	else if (currentType === 'area') {
		areaMarkers.push(marker);
		marker.setMap(map);
	}
	/*
	var jsonText = JSON.stringify(marker.getPosition());
	$.post('dataSend.php', {col: 'position', table: type, data: jsonText});
	*/
	else if (currentType === 'me') {
		myMarker = marker;
		myMarker.setMap(map);
	}
}

function changeMarker(changetype){
	var skateMenu = document.getElementById('skateMenu');
	var basketMenu = document.getElementById('basketMenu');
	var allMunu = document.getElementById('allMenu');

	// 커피숍 카테고리가 클릭됐을 때
	if (changetype === 'skate') {

		// 커피숍 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = 'menu_selected';
		basketMenu.className = '';
		allMenu.className = '';

		// 커피숍 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(map);
		setBasketMarkers(null);
		setAreaMarkers(null);
	}
	else if (changetype === 'basket') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = '';
		basketMenu.className = 'menu_selected';
		allMenu.className = '';

		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(null);
		setBasketMarkers(map);
		setAreaMarkers(null);
	}
	else if (changetype === 'all') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = '';
		basketMenu.className = '';
		allMenu.className = 'menu_selected';

		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(map);
		setBasketMarkers(map);
		setAreaMarkers(null);
	}
	else if(changetype === 'area') {
		skateMenu.className = '';
		basketMenu.className = '';
		allMenu.className = '';

		setSkateMarkers(null);
		setBasketMarkers(null);
		setAreaMarkers(null);
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

function setAreaMarkers(map) {
	for (var i = 0; i < areaMarkers.length; i++) {
		areaMarkers[i].setMap(map);
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

function addPolygon() {
		var polygonPath = [];
		var center = [0,0];
		var position;

		for (i in areaMarkers) {
			position = areaMarkers[i].getPosition();
			polygonPath.push(position);
			center[0] += position.getLat();
			center[1] += position.getLng();
		}
		center[0] /= areaMarkers.length;
		center[1] /= areaMarkers.length;

		var myInfowindow = new daum.maps.InfoWindow({
			position : new daum.maps.LatLng(center[0], center[1]),
			content : '<div style="padding:5px;">Hello World!</div>'
		});

		var polygon = new daum.maps.Polygon({
   			path:polygonPath, // 그려질 다각형의 좌표 배열입니다
   			strokeWeight: 3, // 선의 두께입니다
   			strokeColor: '#39DE2A', // 선의 색깔입니다
   			strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
   			strokeStyle: 'longdash', // 선의 스타일입니다
   			fillColor: '#A2FF99', // 채우기 색깔입니다
   			fillOpacity: 0.7 // 채우기 불투명도 입니다
		});

		var mouseoverOption = { 
			fillColor: '#EFFFED', // 채우기 색깔입니다
			fillOpacity: 0.8 // 채우기 불투명도 입니다        
		};

		// 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
		var mouseoutOption = {
			fillColor: '#A2FF99', // 채우기 색깔입니다 
			fillOpacity: 0.7 // 채우기 불투명도 입니다        
		};
		
		// 다각형에 마우스오버 이벤트를 등록합니다
        daum.maps.event.addListener(polygon, 'mouseover', function() {
	        // 다각형의 채우기 옵션을 변경합니다
    	    polygon.setOptions(mouseoverOption);
			myInfowindow.open(map);
		});   
		daum.maps.event.addListener(polygon, 'mouseout', function() { 
            // 다각형의 채우기 옵션을 변경합니다
            polygon.setOptions(mouseoutOption); 
			myInfowindow.close();
        }); 
		daum.maps.event.addListener(polygon, 'click', function() {
			window.location.href = "https://www.naver.com";
		});
		
		// 지도에 다각형을 표시합니다
		polygon.setMap(map);
		changeMarker("all");
		document.getElementById("setArea").style.display = 'inline';
		document.getElementById("createPolyline").style.display = 'none';

		areaMarkers = [];
		areas.push(polygon);
}
