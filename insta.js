var tagFilter = ["yonsei", "skate", "ipteam"];



var distance = 5000;

var insta_received = false;

var access_token =  "7767454861.f70ce12.888f320125da4d6a823a27fce08aa7c7";


//set true to debug location
//(At Yonsei)
const DEBUG_LOCATION = true;

var insta_hide = true;
document.getElementById("insta_button").addEventListener("click", showInsta, false);

daum.maps.event.addListener(map, 'dragend', function() {
  updateInsta();
});



//Clone template instagram node
var instagram_tmp = document.getElementById("insta-photo");
var instagram_template = document.getElementById("insta-photo").cloneNode(true);
while (instagram_tmp.firstChild) {
      instagram_tmp.removeChild(instagram_tmp.firstChild);
}


function makeSlick(){
   $(".insta-photo").not('.slick-initialized').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    swipe: true,
    asNavFor: '.insta-slide',
   });
   $(".insta-slide").not('.slick-initialized').slick({
     slidesToShow: 3,
     slidesToScroll: 1,
     asNavFor: '.insta-photo',
     dots: true,
    swipe: true,
    centerMode: true,
    touchMove: true,
  });
}



function updateInsta(){

        var xhr = new XMLHttpRequest();

        pos = map.getCenter();
        lat = pos.getLat();
        lng = pos.getLng();
        var url = "get_insta.php?" + "lat=" + lat.toString() + "&lng=" + lng.toString();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                parseInstaData(JSON.parse(xhr.responseText));
                buildInstaFeed();
            }
        };
        xhr.send();
}
   



function showInsta() {
        if(insta_hide == false){
          document.getElementById("insta_button").innerHTML = "Instagram";
          document.getElementById("insta").style.display = "none";
          document.getElementById("map").style.height = '100%';
          map.relayout();
          insta_hide = true;
          return;
        }
        insta_hide = false;
        document.getElementById("insta_button").innerHTML = "[X] Instagram";
        document.getElementById("insta").style.display = "block";
        document.getElementById("map").style.height = '50%';
        map.relayout();

        if(insta_received){
          return;
        }
        var lat;
        var lng;

        if(!DEBUG_LOCATION){
          lat = currentLocation.getLat();
          lng = currentLocation.getLng();
        }
        else{
          lat = 37.565784;
          lng = 126.938572;
        }

        var distance = 5000;

        var xhr = new XMLHttpRequest();

        var url = "get_insta.php?" + "lat=" + lat.toString() + "&lng=" + lng.toString();


        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                parseInstaData(JSON.parse(xhr.responseText));
                buildInstaFeed();
            }
        };
        xhr.send();
        insta_received=true;
}


function postAdded(id, arr){
    for (var i=0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return true;
        }
    }
    return false;
}

			function parseInstaData(json){
				var data = json.data;

				for(var i = 0; i < data.length ; i++){
						for(var str in tagFilter){
							if (data[i].tags.indexOf(tagFilter[str]) > -1 && !postAdded(data[i].id, insta_posts)){
								insta_posts.push(createInstaObj(data[i].id, data[i].link, data[i].user, data[i].images, data[i].caption, data[i].location,data[i].likes,data[i].tags));

                //create daum marker
                //
                var latlng = new daum.maps.LatLng(data[i].location.latitude, data[i].location.longitude);
                var  iwContent = '<div style="padding:5px;">This is me!</div>';
                addMarker(latlng, iwContent, 'insta');
							}	
						}
				}
			}

			function createInstaObj(id, link, user, images, caption, location, likes, tags){
				var post = {
                    id: id,
                    link: link,
                    username:user.username,
                    user_id: user.id,
				 						profile_pic:user.profile_picture,
										image_thumb: images.thumbnail.url,
									  image: images.standard_resolution.url,
										caption: caption.text,
										post_date: caption.created_time,
										location_lat: location.latitude,
										location_long: location.longitude,
										location_name: location.name,
										likes: likes.count,
                    tags: tags,
                    marker: '',
                    gallery:false
										};	

				return post;
			}

      function highlightMarker(p){
        var cur = $(".insta-photo").slick("slickCurrentSlide");
        var m = insta_posts[cur].marker;
        m.setOpacity(1.0);
        m.setMap(map);
        map.setCenter(m.getPosition());
        for(post in insta_posts){
          if(post != cur)
            if(insta_posts[post].marker.getOpacity() == 1.0){
              insta_posts[post].marker.setOpacity(0.4);
          }
        }
      }


			function buildInstaFeed(){

				for(var post in insta_posts){

          insta_posts[post].gallery = true;
          var clone = instagram_template.cloneNode(true);
					var slide_div = document.getElementById("insta-slide");


					var username = document.createTextNode(insta_posts[post].username);
          var x = document.createElement("SPAN");
          x.className = "instaspan";
          x.appendChild(username);
          clone.querySelector("#insta_user").appendChild(x);
          var likes = document.createTextNode(insta_posts[post].likes);
          x = document.createElement("SPAN");
          x.className = "instaheart";
          x.appendChild(likes);
          clone.querySelector("#likes").appendChild(x);
          var location = document.createTextNode(insta_posts[post].location_name);
          
          x = document.createElement("SPAN");
          x.className = "locspan";
          x.appendChild(location);
          clone.querySelector("#insta_location").appendChild(x);
          clone.querySelector("#proflink").href = insta_posts[post].link;
          clone.querySelector("#insta_location").addEventListener("click",
                                                                 function(){
                                                                  highlightMarker();
                                                                 });

          //if(insta_posts[post].profile_pic != null){
          //  var profile_pic = document.createElement("img");
          //  profile_pic.width= 64;
          //  profile_pic.src = insta_posts[post].profile_pic;
          //  profile_div.appendChild(profile_pic);
          //}

          var thumb = document.createElement("div");
          var thumb_img = document.createElement("img");
          thumb_img.src = insta_posts[post].image_thumb;
          thumb.appendChild(thumb_img);
          thumb.className = "instathumb";
          thumb.style.padding = "3px";

          slide_div.appendChild(thumb);
				  
          var imgdiv = clone.querySelector("#instaimg");
					var img = document.createElement("img");
					img.src = insta_posts[post].image;
          img.id = "photo";
          img.height = "400";
          img.width = "400";
          imgdiv.appendChild(img);


					document.getElementById("insta-photo").appendChild(clone);

				}

          makeSlick();

			}


