// 지도를 생성합니다.
var map = map_initialize();
geoLocation();

// 마커를 생성합니다.
var type = 'skate';
var skateMarkers = [];
var basketMarkers = [];

var typeList = ['skate', 'basket']; //마커 종류 추가시 배열에도 추가해주세요.

loadMarkers(typeList);

document.getElementById("setMarker").addEventListener("click", function() {
	iwContent = '<div style="padding:5px;">Hello World!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다	
	addMarker(map.getCenter(), iwContent, type);	
	saveMarker(map.getCenter(), iwContent, type);
});

document.getElementById("setGeolocation").addEventListener("click", geoLocation);

// 지도에 클릭 이벤트를 등록합니다
daum.maps.event.addListener(map, 'click', function(mouseEvent) {        
	// 클릭한 위도, 경도 정보를 가져옵니다 
	var latlng = mouseEvent.latLng;
	// 마커 위치를 클릭한 위치로 옮깁니다
	iwContent = '<div style="padding:5px;">Hello World!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다	
	addMarker(latlng, iwContent, type);
	saveMakrer(latlng, iwContent, type);
});
