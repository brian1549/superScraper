var http = require("http");
var url = require("url");
var express = require("express");

/*TODO:
 * 1.remove dependency on express
 * 2.encode urls
 * 3.fix all 'require's
 * 4.create a way to run a script file (click-thru links)
 * 5. strip http/https
 * 6. check if we are blocking subsequent requests/scrapes 
*/

// this is to scrape shizz
	var util = require('util')
  , httpAgent = require('http-agent')
  , jsdom = require('jsdom').jsdom;


var app = express.createServer();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/'));
});

app.post('/index.html', function(req, res){
	var testStr = '';
	
	var printStats = function(agent) {
		
		var window = jsdom(agent.body).createWindow()
		, $ = require('jquery').create(window);
	
		var bolds = $(req.body.jQuery);
		
		bolds.each(function(i, ele){
			testStr += '(' + i + '): ' + $(ele).html() + '<br />';
		});
		return testStr;
			
	};

	var agent = httpAgent.create(req.body.siteURL.replace('http://',''), ['']);
	
	agent.addListener('next', function (err, agent) {
		testStr += printStats(agent);
	  agent.next();
	});
	
	agent.addListener('stop', function (err, agent) {
	  if (err) console.log(err);
		res.write (testStr);
		res.send(200);
	});
	
	// Start scraping
	agent.start();
    
});

app.listen(8000);