function saveMarker(latlng, iwContent, type, id, pw, named) {

	var forJson = dataTrans(latlng.getLat(), latlng.getLng(), iwContent, type, id, pw, named);
	var jsonText = JSON.stringify(forJson);
	$.post('./db/dataSend.php', {col: 'data', table: type, data: jsonText});
}

function deleteMarker(latlng, iwContent, type, id, pw, named) {
	
	var forJson = dataTrans(latlng.getLat(), latlng.getLng(), iwContent, type, id, pw, named);
	$.post('./db/dataDelete.php', {col: 'data', table: type, data: forJson});
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

function dataTrans(data1, data2) {

	var Obj = {

		Lat: data1,
		Lng: data2
	};
	return Obj;
}

function dataTrans(data1, data2, data3, data4, data5, data6, data7) {

	var Obj = {

		Lat: data1,
		Lng: data2,
		iwContent: data3,
		type: data4,
		id: data5,
		pw: data6,
		named: data7
	};
	return Obj;
}

function loadMarkers(typeList) {

	for (var typeNum in typeList) {
		
		var type = typeList[typeNum];

		$.ajax({

			method:"GET", url:"./db/dataReceive.php", async:false,
			data:{col: 'data', col2: 'created', table: type},
			success:
				function (data, status) {

					var lDO = JSON.parse(data);
					
					for (var objNum in lDO) {

						var ref = JSON.parse(lDO[objNum][0]);
						var tempLatLng = new daum.maps.LatLng(ref.Lat, ref.Lng);
						
						currentMarker = addMarker(tempLatLng, ref.iwContent, type);
						currentMarker.InfoWindow = new daum.maps.InfoWindow({ content : ref.iwContent });
						currentMarker.Id = ref.id;
						currentMarker.pw = ref.pw;
						currentMarker.type = ref.type;
						currentMarker.named = ref.named;
						currentMarker.created = lDO[objNum][1];
					}
				}
		});
	}
}

function loadArea() {
	
	$.ajax({

		method:"GET", url:"./db/dataReceive.php", async:false,
		data:{col: 'data', col2: 'created', table: 'area'},
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
