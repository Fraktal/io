  
/**    
 * Module dependencies.
 */

  var express = require('express');
  var app = express();
  var server = require('http').createServer(app)
  var io = require('socket.io').listen(server);
  var stylus = require('stylus');
  var sentiment = require('sentiment');   


  server.listen(8081);

  var TwitterEventStreamer = require('./twitter/twittereventstreamer');
  var Geocoder = require('./geocoder/geocoder');


  var winston = require('winston');
  var logger = new (winston.Logger)({
      transports: [new (winston.transports.Console)({ level: 'debug' })]
  })

  var tes = new TwitterEventStreamer();
  var geocoder = new Geocoder();

  tes.stream([':)',':(']);
  var tweetcounter = 0;


  /* Stylus compile */
  function compile(str, path) {
     return stylus(str)
    .set('filename', path)
    .use(nib())
  }
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  //app.use(express.favicon("public/images/favicon.ico"));
  app.use(express.cookieParser());
  app.use(express.session({secret: 'recursiveness'}));
  app.use(express.static(__dirname + '/public'))
  app.use(stylus.middleware(
    { src: __dirname + '/public'
      , compile: compile
    }
  ))
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')


  app.get('/tweets', function(req , res){
    var user = req.session.user || {};
    res.render('tweets', {title: 'Tweets'});
  }); 
 
  var websocket = null;
  io.sockets.on('connection', function (socket) {
        websocket = socket;
  });
  
  var failedLookUps = 0;
  var positive = 0;
  var negative = 0;
  var pos_percent = 0.0;
  var neg_percent = 0.0;

  tes.on('tweet', function(tweet) {
        ++tweetcounter;
        logger.debug('Tweet [' + tweetcounter +  '] received from ' + tweet.user.name + ',' + 
                                   tweet.user.location); 

        sentiment(tweet.text, function(err, results) {
            console.log('Score is ' + results.score);
            if(results.score > 0 ) {
                positive++;
                var m = 0;
                m = positive/tweetcounter;
                pos_percent = m.toFixed(2);
                console.log('Positive Count: ' + positive + '  Percent Postive: ' + (pos_percent*100) + '%');
            } 
            if(results.score < 0 ) {
                negative++;
                var n = 0;
                n = negative/tweetcounter;
                neg_percent = n.toFixed(2);
                console.log('Negative Count: ' + negative + '  Percent Negative: ' + (neg_percent*100) + '%');
            }


            geocoder.geocode(tweet.user.location, function(err, geodata) {
                if(!err) {
                    logger.debug('Tweet [' + tweetcounter +  '] received from ' + tweet.user.name + ',' + 
                                     tweet.user.location +  
                                     ' Lat :' + geodata.lat + 
                                     ' Lon :' + geodata.lon);
                    if(websocket !== null) {
                        if(tweet.text.match(/(\s|^)you(\s|$)/i)){
                                websocket.emit('tweet', {poslat: geodata.lat, 
                                                         poslon: geodata.lon,
                                                         count : tweetcounter, 
                                                         failedLookUps: failedLookUps});
                                                         //pos_percent: pos_percent});
                        }
                        if(tweet.text.match(/(\s|^)me(\s|$)/i)){
                                websocket.emit('tweet', {neglat: geodata.lat, 
                                                         neglon: geodata.lon,
                                                         count : tweetcounter, 
                                                         failedLookUps: failedLookUps});
                                                         //neg_percent: neg_percent});
                        }
                    }   
                } else {
                    logger.debug('Could not resolve location for %s' + tweet.user.location 
                                               + ' error was this %s ', err);
                    failedLookUps++;
                    }
           });
      });
  });

