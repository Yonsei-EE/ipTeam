function saveMarker(latlng, iwContent, type, id, pw, named) {

	if(type == 'all')
		return;
	var forJson = dataTrans(latlng.getLat(), latlng.getLng(), iwContent, id, pw, named);
	var jsonText = JSON.stringify(forJson);
	$.post('./db/dataSend.php', {col: 'data', table: type, data: jsonText});
}

function saveArea(markerSet, areaType) {
	
	var jsonArr = new Array();
	for(num in markerSet) {
		var tempLatLng = markerSet[num].getPosition();
		var tempObj = dataTrans(tempLatLng.getLat(), tempLatLng.getLng());
		var jsonMarker = JSON.stringify(tempObj);
		jsonArr.push(tempLatLng);
	}
	
	var pathText = JSON.stringify(jsonArr);
	var Obj = {
		
		Path: pathText,
		type: areaType
	}
	
	var jsonText = JSON.stringify(Obj);
	$.post('./db/dataSend.php', {col: 'data', table: 'area', data: jsonText});
}

function dataTrans(data1, data2, data3) {

	var Obj = {

		Lat: data1,
		Lng: data2,
		iwContent: data3
	};
	return Obj;
}

function dataTrans(data1, data2, data3, data4, data5, data6) {

	var Obj = {

		Lat: data1,
		Lng: data2,
		iwContent: data3,
		id: data4,
		pw: data5,
		named: data6
	};
	return Obj;
}

function loadMarkers(typeList) {

	for (var typeNum in typeList) {
		
		var type = typeList[typeNum];

		$.ajax({

			method:"GET", url:"./db/dataReceive.php", async:false,
			data:{col: 'data', table: type},
			success:
				function (data, status) {

					var lDO = JSON.parse(data);
					
					for (var objNum in lDO) {

						var ref = JSON.parse(lDO[objNum]);
						var tempLatLng = new daum.maps.LatLng(ref.Lat, ref.Lng);

						currentMarker = addMarker(tempLatLng, ref.iwContent, type);
						currentMarker.InfoWindow = new daum.maps.InfoWindow({ content : iwContent });
						currentMarker.id = ref.id;
						currentMarker.pw = ref.pw;
					}
				}
		});
	}
}

function loadArea() {
	
	$.ajax({

		method:"GET", url:"./db/dataReceive.php", async:false,
		data:{col: 'data', table: 'area'},
		success:
			function (data, status) {

				var lDO = JSON.parse(data);
				
				for (var objNum in lDO) {

					var ref = JSON.parse(lDO[objNum]);
					if(ref.type == 'all')
						continue;
					
					var polygonPath = new Array();
					
					var path = JSON.parse(ref.Path);
					
					for(pathNum in path) {
						
						var tempLatLng = new daum.maps.LatLng(path[pathNum].jb, path[pathNum].ib);
						polygonPath.push(tempLatLng);
					}

					addPolygon(polygonPath, ref.type);
				}
			}
	});
}