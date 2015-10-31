// Vender modules
var express = require('express');
var fs = require('fs');
var request = require('request');
// Personal modules
var scraper = require('lib/scraper.js');

var app = express();

app.get('/api', function (req, res) {
	// get url query vars and pass to scraper
	var queryVars = req.query;
	var cleanedQueryVars = scraper.manageInput(queryVars);
	// Send results back to user
	res.send(scraper.getOutput());
	
});

app.listen('8081');

console.log('Server running on port 8081');

exports = module.exports = app;