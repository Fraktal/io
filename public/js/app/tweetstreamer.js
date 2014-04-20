    
    
     var map;
     function initialize() {
            var myLatlng = new google.maps.LatLng(37.09024, -95.712891);
            var mapOptions = {
              center: myLatlng,
              zoom: 3,
              mapTypeId: google.maps.MapTypeId.SATELLITE
            };
            map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
            
     }


    $(document).ready(function() {
        var socket = io.connect('http://localhost:8081');
        socket.on('tweet', function (tweet) {
             console.log(tweet);

            $('#page-body').css({'background-color': '#9E99A8'});  

            //var tweetLatLon = new google.maps.LatLng(tweet.lat, tweet.lon);  
            var posLatLon = new google.maps.LatLng(tweet.poslat, tweet.poslon);
            var negLatLon = new google.maps.LatLng(tweet.neglat, tweet.neglon);   
            
            var infoWindowText = '<div id="content">' + 
                                 '<div id="bodyContent">' + 
                                 '<img src=' +  tweet.profileImage + ' /></br>' + 
                                 tweet.text +    
                                 '</div>' + 
                                 '</div>';
            
            var infowindow = new google.maps.InfoWindow({ 
                     content: infoWindowText,
                     maxWidth: 200
            });

            var red_dot = new google.maps.MarkerImage("https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0");
            var blu_dot = new google.maps.MarkerImage("https://storage.googleapis.com/support-kms-prod/SNP_2752068_en_v0");


            var marker_red = new google.maps.Marker({
                            position: posLatLon,
                            map: map,
                            title: '@' + tweet.user,
                            icon: red_dot,
                            animation: google.maps.Animation.DROP
            });

            
            var marker_blue = new google.maps.Marker({
                            position: negLatLon,
                            map: map,
                            title: '@' + tweet.user,
                            icon: blu_dot,
                            animation: google.maps.Animation.DROP                
            });
            
            google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
            });
                       
            $('#tweetcount').html(tweet.count);             
            $('#failed-lookups').html(tweet.failedLookUps);             
	        
            //emoticon = 'rgb(' + tweet.negative + ', ' + tweet.positive + ', ' + '0)'; 
             

        });
            google.maps.event.addDomListener(window, 'load', initialize);
   });    
        
