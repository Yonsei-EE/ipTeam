function saveMarker(latlng, iwContent, type, id, pw, named) {

	var forJson = dataTrans(latlng.getLat(), latlng.getLng(), iwContent, type, id, pw, named);
	var jsonText = JSON.stringify(forJson);
	$.post('./db/dataSend.php', {col: 'data', table: type, data: jsonText});
}

function deleteMarker(latlng, iwContent, type, id, pw, named) {
	
	var forJson = dataTrans(latlng.getLat(), latlng.getLng(), iwContent, type, id, pw, named);
	$.post('./db/dataDelete.php', {col: 'data', table: type, data: forJson});
}

function saveArea(markerSet, areaType, id, flag) {
	
	var jsonArr = new Array();
	for(num in markerSet) {
		var tempLatLng = markerSet[num];
		var tempObj = dataTrans(tempLatLng.getLat(), tempLatLng.getLng());
		var jsonMarker = JSON.stringify(tempObj);
		jsonArr.push(tempLatLng);
	}
	
	var pathText = JSON.stringify(jsonArr);
	var Obj = {
		
		Path: pathText,
		type: areaType,
		id: id,
		named: flag
	};
	
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

	tempMarker = new daum.maps.Marker();

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
						currentMarker.type = type;
						currentMarker.named = ref.named;
						currentMarker.setDraggable(false);
						currentMarker.created = lDO[objNum][1];
						console.log(currentMarker.created);

						if(currentMarker.type === 'skate') {
							var markerImage = new daum.maps.MarkerImage(
								'images/skateMarker.png',
								new daum.maps.Size(160, 168),
								{
									offset: new daum.maps.Point(52,165),
									alt: "Marker Image",
									shape: "poly",
									coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"
								}
							);
		
							currentMarker.setImage(markerImage);
							skateMarkers.push(currentMarker);
						}
						else if(currentMarker.type === 'basket') {
							var markerImage = new daum.maps.MarkerImage(
								'images/basketMarker.png',
								new daum.maps.Size(160, 168),
								{
									offset: new daum.maps.Point(52,165),
									alt: "Marker Image",
									shape: "poly",
									coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"			
								}
							);
		
							currentMarker.setImage(markerImage);
							basketMarkers.push(currentMarker);
						}
						else if(currentMarker.type === 'fish') {
							var markerImage = new daum.maps.MarkerImage(
								'images/fishMarker.png',
								new daum.maps.Size(160, 168),
								{
									offset: new daum.maps.Point(52,165),
									alt: "Marker Image",
									shape: "poly",
									coords: "53,164,44,139,34,116,23,97,13,83,5,68,1,54,3,40,11,23,24,11,38,4,51,0,67,2,78,9,89,17,100,33,104,51,96,76,83,93,71,114,61,139"	
								}
							);
		
							currentMarker.setImage(markerImage);
							fishMarkers.push(currentMarker);
						}
					}
				changeMarker('all');	
				}
		});
	}

	tempMarker = null;
}

function loadArea() {
	
	$.ajax({

		method:"GET", url:"./db/dataReceive.php", async:false,
		data:{col: 'data', col2: 'created', table: 'area'},
		success:
			function (data, status) {

				var lDO = JSON.parse(data);
				
				for (var objNum in lDO) {

					var ref = JSON.parse(lDO[objNum][0]);
					if(ref.type == 'all')
						continue;
					
					var polygonPath = new Array();
					
					var path = JSON.parse(ref.Path);
					
					for(pathNum in path) {
						
						var tempLatLng = new daum.maps.LatLng(path[pathNum].jb, path[pathNum].ib);
						polygonPath.push(tempLatLng);
					}

					currentPolygon = addPolygon(polygonPath, ref.type);
					currentPolygon.Id = ref.id;
					currentPolygon.named = ref.named;
					currentPolygon.created = lDO[objNum][1];

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

					tempPolygon = null;
				}
			}
	});
}
