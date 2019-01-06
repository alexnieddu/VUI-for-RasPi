// HTTPS Server to run user interface
// Examples (Samsung TV, Volumio)
var http = require("http");
var https = require("https");
var fs = require("fs");
var express = require("express");
var app = express();
var path = require('path');
var exec = require("child_process").exec;
var say = require("say");
var SamsungRemote = require('samsung-remote');
var remote = new SamsungRemote({
	ip: '192.168.0.1' // required: IP address of your Samsung Smart TV
});

var port = 8000;
var commands = {
			play: ["mucke", "musik", "party"],
			stop: ["stopp", "pause"],
			next: ["weiter", "nächster song"],
			back: ["zurück"],
			lauter: ["lauter"],
			leiser: ["leiser"],
			uhr: ["uhr", "uhrzeit", "spät ist es"],
			tvaus: ["fernseh aus", "fernseher aus"],
			tvguide: ["programm"]
		};

var sslOptions = {
	key: fs.readFileSync('./ssl/key.pem'),
	cert: fs.readFileSync('./ssl/cert.pem'),
	passphrase: 'stark'
};

app.use(express.static("./public"));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/page.html'));
	//console.log(JSON.stringify(req.query));
	if(!isEmpty(req.query)) {
		speech = req.query.befehl.toLowerCase();
		
		if( contains(speech, commands.play) ) {
			exec("volumio play", function() { console.log("works"); })
		} else if( contains(speech, commands.stop) ) {
			exec("volumio pause", function() { console.log("works"); })
		} else if( contains(speech, commands.next) ) {
			exec("volumio next", function() { console.log("works"); })
		} else if( contains(speech, commands.back) ) {
			exec("volumio previous", function() { console.log("works"); })
		} else if( contains(speech, commands.lauter) ) {
			exec("volumio volume plus", function() { console.log("works"); })
		} else if( contains(speech, commands.leiser) ) {
			exec("volumio volume minus", function() { console.log("works"); })
		} else if( contains(speech, commands.tvaus) ) {
			remote.send('KEY_POWEROFF', function callback(err) {
				if (err) {
					throw new Error(err);
				} else {
					console.log("works");
				}
			});
		} else if( contains(speech, commands.tvguide) ) {
			remote.send('KEY_GUIDE', function callback(err) {
				if (err) {
					throw new Error(err);
				} else {
					console.log("works");
				}
			});
		} else if( contains(speech, commands.uhr) ) {
			var d = new Date();
			say.speak("it is " + d.getHours() + d.getMinutes() + " o clock, your Lordship.", 0.86);
		}
		console.log(speech);
	}
});

var server = https.createServer(sslOptions, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

function contains(target, pattern){
    var value = 0;
    pattern.forEach(function(word){
      value = value + target.includes(word);
    });
    if (value === 1) return true;
    else return false;
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}