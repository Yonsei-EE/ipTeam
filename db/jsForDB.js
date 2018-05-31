function saveMarker(latlng, iwContent, type) {

	var forJson = dataTrans(latlng.getLat(), latlng.getLng(), iwContent);
	var jsonText = JSON.stringify(forJson);
	$.post('./db/dataSend.php', {col: 'data', table: type, data: jsonText});
}

function dataTrans(data1, data2, data3) {

	var Obj = {

		Lat: data1,
		Lng: data2,
		iwContent: data3
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

						addMarker(tempLatLng, ref.iwContent, type);
					}
				}
		});
	}
}
