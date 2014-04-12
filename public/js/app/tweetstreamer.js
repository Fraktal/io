    
    
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
        var socket = io.connect('http://localhost:3000');
        socket.on('tweet', function (tweet) {
             console.log(tweet);
             //var row = '<tr><td>' + tweet.user + '</td><td>' + tweet.text + '</td></th>';
             
             /*if( $('#tweets tr').size() > 8) {
                $('#tweets tr:last').fadeOut(500,function(row) {
                    $('#tweets tr:last').remove();    
                    $('#tweets tr:first').after(row);             
                    $('#tweetcount').html(tweet.count);             
                 });
               } else {
                    $('#tweets tr:first').after(row);             
                    $('#tweetcount').html(tweet.count);             
              } */

            $('#page-body').css({'background-color': '#9E99A8'});  

            var tweetLatLon = new google.maps.LatLng(tweet.lat, tweet.lon);  
            var posLatLon = new google.maps.LatLng(pos_tweet.lat, pos_tweet.lon);
            var negLatLon = new google.maps.LatLng(neg_tweet.lat, neg_tweet.lon);   
            
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
            
            $('#positive').html(Math.round((tweet.positive / 255) * 100) + ' % ');             
            $('#negative').html(Math.round((tweet.negative / 255) * 100) + ' % ');             
            $('#tweetcount').html(tweet.count);             
            $('#failed-lookups').html(tweet.failedLookUps);             
	        
            emotion = 'rgb(' + tweet.negative + ', ' + tweet.positive + ', ' + '0)'; 
            console.log('emotion is ' + emotion);
             

        });
            google.maps.event.addDomListener(window, 'load', initialize);
   });    
        
