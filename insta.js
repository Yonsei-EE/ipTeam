			var insta_url = "https://api.instagram.com/v1/media/";

			
			//Geolocation constant for now
      while(currentLocation == null){
        var lat = currentLocation.getLat();
        var lng = currentLocation.getLng();
      }
      console.log(lat);
			var access_token =  "7767454861.f70ce12.888f320125da4d6a823a27fce08aa7c7";
			var distance = 5000;

			var xhr = new XMLHttpRequest();
			//var url = insta_url + "search?lat="+lat.toString() + "&lng=" +lng.toString()
		  //	+"&access_token=" + access_token +"&distance=" + distance; 

      var url = "localhost/hello.php?" + "lat=" + lat.toString() + "&lng=" + lng.toString();

			xhr.open("GET", url, true);
			xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
							parseInstaData(JSON.parse(xhr.responseText));
							buildInstaFeed();
					}
			};
			xhr.send();

			var tagFilter = ["yonsei", "skate", "ipteam"];
			var insta_posts= [];

			function parseInstaData(json){
				var data = json.data;

				for(var i = 0; i < data.length ; i++){
						for(var str in tagFilter){
							if (data[i].tags.indexOf(tagFilter[str]) > -1){
								insta_posts.push(createInstaObj(data[i].user, data[i].images, data[i].caption, data[i].location,data[i].likes));
								break;
							}	
						}
				}
			}

			function createInstaObj(user, images, caption, location, likes){

				//time is in linux timestamp format,  needs to be converted to date
				var post = {username:user.username,
				 						profile_pic:user.profile_picture,
										image_thumb: images.thumbnail.url,
									  image: images.standard_resolution.url,
										caption: caption.text,
										post_date: caption.created_time,
										location_lat: location.latitude,
										location_long: location.longitude,
										location_name: location.name,
										likes: likes.count
										};	

				return post;


			}


			function buildInstaFeed(){

				for(var post in insta_posts){
					var div = document.getElementById("insta");

					var instapost = document.createElement("div");

					var profile_div = document.createElement("div");
					profile_div.className = "insta_profile";
					
					var username = document.createTextNode(insta_posts[post].username);

          if(insta_posts[post].profile_pic != null){
            var profile_pic = document.createElement("img");
            profile_pic.width= 64;
            profile_pic.src = insta_posts[post].profile_pic;
            profile_div.appendChild(profile_pic);
          }
					profile_div.appendChild(username);
					
					var img = document.createElement("img");
					img.width = 320;

					img.src = insta_posts[post].image;
					instapost.appendChild(profile_div);
					instapost.appendChild(img);
					div.appendChild(instapost);

				}

			}


