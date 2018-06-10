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
	var str;
	switch (error.code)
	{
		case error.PERMISSION_DENIED:
			str = "User denied the request for Geolocation.";
			break;
		case error.POSITION_UNAVAILABLE:
			str = "Location information is unavailable.";
			break;
		case error.TIMEOUT:
			str = "The request to get user location timed out.";
			break;
		case error.UNKNOWN_ERROR:
			str = "An unknown error occured."; 
			break;
	}
	str += " Trying Google Geolocation API.";
	if(!alerted) {
		alert(str);
		alerted = true;
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

function clearInner(node) {
		while(node.hasChildNodes()) {
				clear(node.firstChild);
		}
}

function clear(node) {
		while(node.hasChildNodes()) {
				clear(node.firstChild);
		}
		node.parentNode.removeChild(node);
}

function addMarker(position, iwContent, currentType) {
	if(currentType == 'all') {
		//alert("Please specify marker category.");
		return;
	}
	
	var markerImage = new daum.maps.MarkerImage(
		'images/marker_resize.png',
		new daum.maps.Size(160, 168),
		{
			offset: new daum.maps.Point(52,165),
			alt: "Marker Image",
			shape: "poly",
			coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"							}
	);

  console.log(position);
	
	var marker = new daum.maps.Marker({
		position: position,
		image : markerImage,
		clickable: true,
	});

	marker.setDraggable(true);

	// 인포윈도우를 생성합니다
	var myInfowindow = new daum.maps.InfoWindow({
		position : position,
		content : iwContent
	});

	marker.infoWindow = myInfowindow;

	if(currentType!='area') {
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
	}
	marker.named = false;
	marker.type = 'temp';
	marker.clicked = 0;

  //Instagram 
  if(currentType == 'insta'){
        var markerImage = new daum.maps.MarkerImage(
          'images/insta_pin.png',
          new daum.maps.Size(32, 32),
          {
            offset: new daum.maps.Point(16,16),
            alt:  "Marker Image",
            shape: "poly",
          });
    marker.setImage(markerImage);
    marker.setOpacity(0.4);
    insta_posts[insta_posts.length -1].marker = marker;
    marker.setMap(map);
    return;
  }


	daum.maps.event.addListener(marker, 'click', function() {
		if(currentType!='area'){
		var mapDiv = document.getElementById('map');
		var infoDiv = document.getElementById('info');
		var currentMarker = this;
		if(this.named == false && this.clicked==0) {
			infoDiv.innerHTML = '';
			currentId = 'empty';
			marker.clicked++;
			var h2 = document.createElement('H2');
			h2.innerHTML = 'Enter your name and sport';
			infoDiv.appendChild(h2);
		 	var myForm = document.createElement('FORM');
			myForm.name='myForm';
			myForm.method='POST';
			myForm.action='';

			var fieldset = document.createElement('FIELDSET');
			var p1 = document.createElement('P');
			var myName = document.createElement('INPUT');
			myName.type='TEXT';
			myName.id='name';
			p1.appendChild(myName);
			fieldset.appendChild(p1);

			var p2 = document.createElement('P');

			var myType = document.createElement('SELECT');
			myType.id='type';

		    var skateOption = document.createElement("option");
			skateOption.setAttribute("value", "skate");
			var basketOption = document.createElement("option");
			basketOption.setAttribute("value", "basket");
			var fishOption = document.createElement("option");
			fishOption.setAttribute("value", "fish");

			var skateTxt = document.createTextNode("skateboarding");
			skateOption.appendChild(skateTxt);
			var basketTxt = document.createTextNode("basketball");
			basketOption.appendChild(basketTxt);
			var fishTxt = document.createTextNode("fishing");
			fishOption.appendChild(fishTxt);
			myType.appendChild(skateOption);
		    myType.appendChild(basketOption);
			myType.appendChild(fishOption);
			if(currentType!='me')
				myType.value=currentType;
			p2.appendChild(myType);
			fieldset.appendChild(p2);

			var p3 = document.createElement('P');

			var myPW = document.createElement('INPUT');
			myPW.type='PASSWORD';
			myPW.id='pw';
			p3.appendChild(myPW);
			fieldset.appendChild(p3);
			myForm.appendChild(fieldset);

			var nameLabel = document.createElement("LABEL");
			var nameLabelTxt = document.createTextNode("Name");
			nameLabel.setAttribute("for", "name");
			nameLabel.appendChild(nameLabelTxt);
			p1.insertBefore(nameLabel,myName);

			var typeLabel = document.createElement("LABEL");
			var typeLabelTxt = document.createTextNode("Sport");
			typeLabel.setAttribute("for", "type");
			typeLabel.appendChild(typeLabelTxt);
			p2.insertBefore(typeLabel,myType);

			var pwLabel = document.createElement("LABEL");
			var pwLabelTxt = document.createTextNode("PW");
			pwLabel.setAttribute("for", "pw");
			pwLabel.appendChild(pwLabelTxt);
			p3.insertBefore(pwLabel,myPW);

			infoDiv.appendChild(myForm);
			
			var btn = document.createElement('BUTTON');
			btn.addEventListener('click', function() {
					currentMarker.infoWindow.setContent('<div>'+myName.value+'</div>');
					currentMarker.Id = myName.value;
					currentMarker.type = myType.value;
					currentMarker.named = true;
					currentMarker.pw = myPW.value;
					if(currentMarker.type === 'skate') {
						var markerImage = new daum.maps.MarkerImage(
							'images/skateMarker.png',
							new daum.maps.Size(160, 168),
							{
								offset: new daum.maps.Point(52,165),
								alt: "Marker Image",
								shape: "poly",
								coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"								});
						marker.setImage(markerImage);
						skateMarkers.push(marker);
					}
					else if(currentMarker.type === 'basket') {
						var markerImage = new daum.maps.MarkerImage(
							'images/basketMarker.png',
							new daum.maps.Size(160, 168),
							{
								offset: new daum.maps.Point(52,165),
								alt: "Marker Image",
								shape: "poly",
								coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"								});
						marker.setImage(markerImage);
						basketMarkers.push(marker);
					}
					else if(currentMarker.type === 'fish') {
						var markerImage = new daum.maps.MarkerImage(
							'images/fishMarker.png',
							new daum.maps.Size(160, 168),
							{
								offset: new daum.maps.Point(52,165),
								alt: "Marker Image",
								shape: "poly",
								coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"								});
						marker.setImage(markerImage);
						fishMarkers.push(marker);
					}
					
					mapDiv.style.height = '100%';
					infoDiv.style.height = '0%';
					clearInner(infoDiv);
					map.relayout();
					currentMarker.setDraggable(false);

					tempMarker = null;

					saveMarker(currentMarker.getPosition(), currentMarker.infoWindow.getContent(), currentMarker.type, currentMarker.Id, currentMarker.pw, currentMarker.named);
			});
			btnTxt = document.createTextNode('Submit');
			btn.style.float = "right";
			btn.style.marginRight = '15px';
			btn.appendChild(btnTxt);
			infoDiv.appendChild(btn);

			if(mapDiv.style.height == '100%') {
				mapDiv.style.height = '50%';
				info.style.display = "block";
				infoDiv.style.height = '50%';
				map.relayout();
			}
		}
		else if(this.named == false && this.clicked == 1) {
				mapDiv.style.height = '100%';
				infoDiv.style.height = '0%';
				map.relayout();
				this.clicked++;
		}
		else if(this.named == false && this.clicked == 2) {
				mapDiv.style.height = '50%';
				infoDiv.style.display = "block";
				infoDiv.style.height = '50%';
				map.relayout();
				this.clicked=1;
		}
		else {
			if(tempMarker!=null)
					tempMarker.clicked = 0;
			if(tempPolygon!=null)
					tempPolygon.clicked = 0;
			if(currentId == this.Id) {
				mapDiv.style.height = '100%';
				infoDiv.style.height = '0%';
				map.relayout();
				currentId = 'empty';
			}
			else {
				var str = 'This is ' + this.Id + '.';
				if(this.type==='skate')
					str += ' He is skateboarding.';
				else if(this.type==='basket')
					str += ' He is playing basketball.';
				else if(this.type==='fish')
					str += ' He is fishing.';
				infoDiv.innerHTML = str;
				currentId = this.Id;
				if(mapDiv.style.height == '100%') {
					mapDiv.style.height = '50%';
					infoDiv.style.height = '50%';
					map.relayout();
				}
			}
		}
	}
	});

	daum.maps.event.addListener(marker, 'rightclick', function() {
		if(this.pw=='' || this.type == 'temp') {
			myInfowindow.close();
			marker.setMap(null);
			clearInterval(interval);
		}
		else {
			var pw = prompt("Enter password");
			if(pw == this.pw) {
				myInfowindow.close();
				marker.setMap(null);
				clearInterval(interval);
			}
			else
				alert("Wrong password!");
		}
	});

	
	if (currentType === 'area') {
		var markerImage = new daum.maps.MarkerImage(
			'images/red_pin.png',
			new daum.maps.Size(150, 161),
			{
				offset: new daum.maps.Point(34,143),
				alt: "Marker Image",
				shape: "poly",
				coords: "13,138,19,148,34,152,48,150,42,139,62,113,79,118,96,114,108,107,114,92,117,79,113,65,132,57,130,32,115,19,95,15,81,24,81,42,53,47,38,67,43,93,51,107,33,136,42,139,23,133"
			}
		);
		
		areaMarkers.push(marker);
		marker.setImage(markerImage);
		marker.setMap(map);
	}
	else if (currentType === 'me') {
		var markerImage = new daum.maps.MarkerImage(
			'images/person.png',
			new daum.maps.Size(200, 200),
			{
				offset: new daum.maps.Point(102,178),
				alt: "Marker Image",
				shape: "poly",
				coords: "96,178,92,169,85,136,77,124,77,89,83,80,91,74,100,74,100,69,93,66,87,63,84,51,84,42,91,33,103,29,114,32,121,43,122,57,115,66,105,69,106,74,115,76,124,82,126,88,127,120,124,127,120,134,116,149,113,169,109,177"
			}
		);

		marker.setImage(markerImage);
		if(myMarker==null) {
			myMarker = marker;
			marker.setMap(map);
		}
	}
	else {
		if(tempMarker == null) {
			tempMarker = marker;
			marker.setMap(map);
		}
		else {
			tempMarker.setPosition(position);
			tempMarker.setMap(map);
		}
	}

	return marker;
}

function changeMarker(changetype){
	var skateMenu = document.getElementById('skateMenu');
	var basketMenu = document.getElementById('basketMenu');
	var fishMenu = document.getElementById('fishMenu');
	var allMenu = document.getElementById('allMenu');

	// 커피숍 카테고리가 클릭됐을 때
	if (changetype === 'skate') {

		// 커피숍 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = 'menu_selected';
		basketMenu.className = 'menu';
		fishMenu.className = 'menu';
		allMenu.className = 'menu';

		// 커피숍 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(map);
		setBasketMarkers(null);
		setFishMarkers(null);
		setAreaMarkers(null);
	}
	else if (changetype === 'basket') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = 'menu';
		basketMenu.className = 'menu_selected';
		fishMenu.className = 'menu';
		allMenu.className = 'menu';

		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(null);
		setBasketMarkers(map);
		setFishMarkers(null);
		setAreaMarkers(null);
	}
	else if (changetype === 'fish') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = 'menu';
		basketMenu.className = 'menu';
		fishMenu.className = 'menu_selected';
		allMenu.className = 'menu';

		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(null);
		setBasketMarkers(null);
		setFishMarkers(map);
		setAreaMarkers(null);
	}

	else if (changetype === 'all') { // 편의점 카테고리가 클릭됐을 때
		// 편의점 카테고리를 선택된 스타일로 변경하고
		skateMenu.className = 'menu';
		basketMenu.className = 'menu';
		fishMenu.className = 'menu';
		allMenu.className = 'menu_selected';

		// 편의점 마커들만 지도에 표시하도록 설정합니다
		setSkateMarkers(map);
		setBasketMarkers(map);
		setFishMarkers(map);
		setAreaMarkers(null);

	}
	type = changetype;
}

function setSkateMarkers(map) {
	for (var i = 0; i < skateMarkers.length; i++) {
		skateMarkers[i].setMap(map);
	}
}

function setInstaMarkers(map){
for (var i = 0; i < skateMarkers.length; i++) {
		instaMarkers[i].setMap(map);
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
function setFishMarkers(map) {
	for (var i = 0; i < fishMarkers.length; i++) {
		fishMarkers[i].setMap(map);
	}
}

function addPolygon(polygonPath, currentType) {
		var center = [0,0];
		var position;

		if(polygonPath.length == 0) {
			for (i in areaMarkers) {
				position = areaMarkers[i].getPosition();
				polygonPath.push(position);
			}
		}

		for (i in polygonPath) {
			center[0] += polygonPath[i].getLat();
			center[1] += polygonPath[i].getLng();
		}
		center[0] /= polygonPath.length;
		center[1] /= polygonPath.length;

		var myInfowindow = new daum.maps.InfoWindow({
			position : new daum.maps.LatLng(center[0], center[1]),
			content : '<div style="padding:5px;">Hello World!</div>'
		});

		console.log(center[0],center[1]);

		var polygon = new daum.maps.Polygon({
   			path:polygonPath, // 그려질 다각형의 좌표 배열입니다
   			strokeWeight: 3, // 선의 두께입니다
   			strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
   			strokeStyle: 'longdash', // 선의 스타일입니다
   			fillOpacity: 0.7, // 채우기 불투명도 입니다
			strokeColor: '#363738', // 선의 색깔입니다
			fillColor: '#f2f4f7', // 채우기 색깔입니다
		});

		polygon.infoWindow = myInfowindow;
		polygon.clicked = 0;
		polygon.type = currentType;
		this.named = false;

		var mouseoverOption = { 
			//fillColor: '#EFFFED', // 채우기 색깔입니다
			fillOpacity: 0.9 // 채우기 불투명도 입니다        
		};

		// 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
		var mouseoutOption = {
			//fillColor: '#A2FF99', // 채우기 색깔입니다 
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
		var mapDiv = document.getElementById('map');
		var infoDiv = document.getElementById('info');
		var currentPolygon = this;
		if(this.named == false && this.clicked==0) {
			infoDiv.innerHTML = '';
			currentId = 'empty';
			currentPolygon.clicked++;
			var h2 = document.createElement('H2');
			h2.innerHTML = 'Enter the location and sport';
			infoDiv.appendChild(h2);
		 	var myForm = document.createElement('FORM');
			myForm.name='myForm';
			myForm.method='POST';
			myForm.action='';

			var fieldset = document.createElement('FIELDSET');
			var p1 = document.createElement('P');
			var myName = document.createElement('INPUT');
			myName.type='TEXT';
			myName.id='name';
			p1.appendChild(myName);
			fieldset.appendChild(p1);

			var p2 = document.createElement('P');

			var myType = document.createElement('SELECT');
			myType.id='type';

		    var skateOption = document.createElement("option");
			skateOption.setAttribute("value", "skate");
			var basketOption = document.createElement("option");
			basketOption.setAttribute("value", "basket");
			var fishOption = document.createElement("option");
			fishOption.setAttribute("value", "fish");

			var skateTxt = document.createTextNode("skateboarding");
			skateOption.appendChild(skateTxt);
			var basketTxt = document.createTextNode("basketball");
			basketOption.appendChild(basketTxt);
			var fishTxt = document.createTextNode("fishing");
			fishOption.appendChild(fishTxt);
			myType.appendChild(skateOption);
		    myType.appendChild(basketOption);
			myType.appendChild(fishOption);
			myType.value=type;
			p2.appendChild(myType);
			fieldset.appendChild(p2);
			myForm.appendChild(fieldset);

			var nameLabel = document.createElement("LABEL");
			var nameLabelTxt = document.createTextNode("Location");
			nameLabel.setAttribute("for", "name");
			nameLabel.appendChild(nameLabelTxt);
			p1.insertBefore(nameLabel,myName);

			var typeLabel = document.createElement("LABEL");
			var typeLabelTxt = document.createTextNode("Sport");
			typeLabel.setAttribute("for", "type");
			typeLabel.appendChild(typeLabelTxt);
			p2.insertBefore(typeLabel,myType);
			infoDiv.appendChild(myForm);
			
			var btn = document.createElement('BUTTON');
			btn.addEventListener('click', function() {
					currentPolygon.Id = myName.value;
					currentPolygon.type = myType.value;
					currentPolygon.named = true;
					if(currentPolygon.type === 'skate') {
						currentPolygon.setOptions({
			   				strokeColor: '#39DE2A', // 선의 색깔입니다
			   				fillColor: '#A2FF99', // 채우기 색깔입니다
						});
						skateAreas.push(currentPolygon);
					}
			
					else if(currentPolygon.type === 'basket') {
						currentPolygon.setOptions({
			   				strokeColor: '#ff3333', // 선의 색깔입니다
			   				fillColor: '#ffb3b3', // 채우기 색깔입니다
						});
						basketAreas.push(currentPolygon);
					}
					else if(currentPolygon.type === 'fish') {
						currentPolygon.setOptions({
			   				strokeColor: '#6699ff', // 선의 색깔입니다
			   				fillColor: '#ccddff', // 채우기 색깔입니다
						});
						fishAreas.push(currentPolygon);
					}
											
					mapDiv.style.height = '100%';
					infoDiv.style.height = '0%';
					clearInner(infoDiv);
					map.relayout();

					tempPolygon = null;

			});
			btnTxt = document.createTextNode('Submit');
			btn.style.float = "right";
			btn.style.marginRight = '15px';
			btn.appendChild(btnTxt);
			infoDiv.appendChild(btn);

			if(mapDiv.style.height == '100%') {
				mapDiv.style.height = '50%';
				infoDiv.style.display = 'block';
				infoDiv.style.height = '50%';
				map.relayout();
			}
		}
		else if(this.named == false && this.clicked == 1) {
				mapDiv.style.height = '100%';
				infoDiv.style.height = '0%';
				map.relayout();
				this.clicked++;
		}
		else if(this.named == false && this.clicked == 2) {
				mapDiv.style.height = '50%';
				infoDiv.style.display = 'block';
				infoDiv.style.height = '50%';
				map.relayout();
				this.clicked=1;
		}
		else {
			if(tempMarker!=null)
					tempMarker.clicked = 0;
			if(tempPolygon!=null)
					tempPolygon.clicked = 0;
			if(currentId == this.Id) {
				mapDiv.style.height = '100%';
				infoDiv.style.height = '0%';
				map.relayout();
				currentId = 'empty';
			}
			else {
				var str = 'This is ' + this.Id + '.';
				if(this.type==='skate')
					str += ' It is for skateboarding.';
				else if(this.type==='basket')
					str += ' It is for playing basketball.';
				else if(this.type==='fish')
					str += ' It is for fishing.';
				infoDiv.innerHTML = str;
				currentId = this.Id;
				if(mapDiv.style.height == '100%') {
					mapDiv.style.height = '50%';
					infoDiv.style.height = '50%';
					map.relayout();
				}
			}
		}
		});

		if(tempPolygon == null) {
			tempPolygon = polygon;
			polygon.setMap(map);
		}
		else {
			tempPolygon.setPath(polygonPath);
			center = [0,0];
			for (i in polygonPath) {
				center[0] += polygonPath[i].getLat();
				center[1] += polygonPath[i].getLng();
			}
			center[0] /= polygonPath.length;
			center[1] /= polygonPath.length;

			tempPolygon.infoWindow.setPosition(new daum.maps.LatLng(center[0], center[1]));
			tempPolygon.setMap(map);
		}

		// 지도에 다각형을 표시합니다
		//changeMarker("all");
		document.getElementById("setArea").style.display = 'inline';
		document.getElementById("createPolyline").style.display = 'none';
		
		setAreaMarkers(null);
		areaMarkers = [];
		areas.push(polygon);

		return polygon;

}
