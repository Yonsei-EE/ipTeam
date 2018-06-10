var tagFilter = ["yonsei", "skate", "ipteam"];
var insta_posts= [];

var insta_received = false;


//set true to debug location
//(At Yonsei)
const DEBUG_LOCATION = true;

var insta_hide = true;
document.getElementById("insta_button").addEventListener("click", showInsta, false);


//Clone template instagram node
var instagram_tmp = document.getElementById("insta-photo");
var instagram_template = document.getElementById("insta-photo").cloneNode(true);
while (instagram_tmp.firstChild) {
      instagram_tmp.removeChild(instagram_tmp.firstChild);
}

//Make photo gallery
//
/*
function makeSlick(){
  $(".insta-slide").not('.slick-initialized').slick({
    arrows: true,

    slidesPerRow: 2,
    rows: 2,
    swipe: true,
    responsive: [
    {
      breakpoint: 478,
      settings: {
        slidesPerRow: 1,
        rows: 1,

      }
    }
  ]
  });
} 
*/

function makeSlick(){
   $(".insta-photo").not('.slick-initialized').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    swipe: true,
    asNavFor: '.insta-slide'
   });
   $(".insta-slide").slick({
     slidesToShow: 3,
     slidesToScroll: 1,
     useCSS: true,
     asNavFor: '.insta-photo',
     dots: true,
    swipe: true,
    centerMode: true,
    touchMove: true,
    focusOnSelect: true,
  });
}



function showInsta() {
        if(insta_hide == false){
          document.getElementById("insta_button").innerHTML = "Instagram";
          document.getElementById("insta").style.display = "none";
          document.getElementById("map").style.height = '100%';
          insta_hide = true;
          return;
        }
        insta_hide = false;
        document.getElementById("insta_button").innerHTML = "Close Instagram";
        document.getElementById("insta").style.display = "block";
        document.getElementById("map").style.height = '50%';

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

        var access_token =  "7767454861.f70ce12.888f320125da4d6a823a27fce08aa7c7";
        var distance = 5000;

        var xhr = new XMLHttpRequest();
        //var url = insta_url + "search?lat="+lat.toString() + "&lng=" +lng.toString()
        //	+"&access_token=" + access_token +"&distance=" + distance; 

        //var url = "http://localhost/get_insta.php?" + "lat=" + lat.toString() + "&lng=" + lng.toString();
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

			function parseInstaData(json){
				var data = json.data;

				for(var i = 0; i < data.length ; i++){
						for(var str in tagFilter){
							if (data[i].tags.indexOf(tagFilter[str]) > -1){
								insta_posts.push(createInstaObj(data[i].user, data[i].images, data[i].caption, data[i].location,data[i].likes,data[i].tags));

                //create daum marker
                //
                //var latlng = new daum.maps.LatLng(data[i].location.latitude, data[i].location.longitude);
                //var  iwContent = '<div style="padding:5px;">This is me!</div>';
                //addMarker(latlng, iwContent, 'insta');
							}	
						}
				}
			}

			function createInstaObj(user, images, caption, location, likes, tags){
				var post = {username:user.username,
                    user_id:, user.id,
				 						profile_pic:user.profile_picture,
										image_thumb: images.thumbnail.url,
									  image: images.standard_resolution.url,
										caption: caption.text,
										post_date: caption.created_time,
										location_lat: location.latitude,
										location_long: location.longitude,
										location_name: location.name,
										likes: likes.count,
                    tags: tags
										};	

				return post;
			}


      function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }



			function buildInstaFeed(){

				for(var post in insta_posts){
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
					img.width = 500;
          img.height = 500;;
					img.src = insta_posts[post].image;
          imgdiv.appendChild(img);

					document.getElementById("insta-photo").appendChild(clone);

				}

          makeSlick();

			}


