// 지도를 생성합니다.
var alerted = false;
var map = map_initialize();
var startup = true;
var currentLocation;
var currentId;
geoLocation();

// 마커를 생성합니다.
var prevType;
var type = 'all';
var tempPolygon = null;
var tempMarker = null;
var skateMarkers = [];
var basketMarkers = [];
var fishMarkers = [];
var areaMarkers = [];
var instaMarkers = [];
var areas = [];
var skateAreas = [];
var basketAreas = [];
var fishAreas = [];
var myMarker = null;
var interval;

var typeList = ['skate', 'basket', 'fish']; //마커 종류 추가시 배열에도 추가해주세요.

loadMarkers(typeList);
loadArea();

document.getElementById("setMarker").addEventListener("click", function() {
	iwContent = '<div style="padding:5px;">This is me!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
	addMarker(map.getCenter(), iwContent, 'me');
	interval = setInterval(function() {
			geoLocation();
			if(currentLocation!=null) {
				myMarker.setPosition(currentLocation);
				myMarker.setMap(map);
			}
			}, 3000)
});

document.getElementById("setGeolocation").addEventListener("click", function() {
	geoLocation();
	map.panTo(currentLocation);
});

document.getElementById("setArea").addEventListener("click", function() {
		//changeMarker("area");
		prevType = type;
		type = 'area';
		document.getElementById("setArea").style.display = 'none';
		document.getElementById("createPolyline").style.display = 'inline';
});

document.getElementById("createPolyline").addEventListener("click", function() {
	saveArea(areaMarkers, prevType);
	addPolygon([], prevType);
	type = prevType;
});

daum.maps.event.addListener(map, 'click', function(mouseEvent) {
		var latlng = mouseEvent.latLng;
		iwContent = '<div style="padding:5px;">Hello World!</div>';
		addMarker(latlng, iwContent, type);
});
