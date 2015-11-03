// Vender modules
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
// Personal modules
var scraper = require('./lib/scraper');

var app = express();

app.get('/api', function (req, res) {
	// get url query vars and pass to scraper
	
	async.waterfall([
		function (callback) {
			var queryVars = req.query;
			if (false) {
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
		if (error) {
			// Send default error JSON suggesting user lookup quote on own
		}
		else {
			res.send(result);
		}
	});	
});

app.listen('8081');

console.log('Server running on port 8081');

exports = module.exports = app;