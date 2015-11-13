// Vender modules
var express = require('express');
var async = require('async');
var cors = require('cors');
// Personal modules
var scraper = require('./lib/scraper');

var app = express();

var port = process.env.PORT || 8080;

app.options('/api', cors());

app.use(express.static(__dirname + '/public'));

app.get('/api', cors(),  function (req, res) {
	// get url query vars and pass to scraper
	
	async.waterfall([
		function (callback) {
			var queryVars = req.query;
			if (!queryVars.author || !queryVars.quote) {
				// query vars not specified correctly
				callback(true, queryVars);
			}
			else {
				// query vars specified correctly  
				callback(null, queryVars);
			}
		},
		scraper.manageInput, // Passes cleanName, cleanQuote to callback
		scraper.scrape, // Passes cleanName, cleanQuote, [quoteArray] to callback
		scraper.calcAuthenticity, // Passes JSON string to callback
		
		], 
		function (error, jsonResults) { // Function to call at end of waterfall
			res.setHeader('Content-Type', 'application/json');
			var result;
			if (error) {
				// Send default error JSON suggesting user lookup quote on own
				result = JSON.stringify({
					"error": "true"
				});
			}
			else {
				result = jsonResults;
			}
			
			res.send(result);
		});	
	});

app.get('*', function (req, res) {
	res.sendStatus(404);
});

app.listen(port);

console.log('Server running on port ' + port);

exports = module.exports = app;