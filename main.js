var express = require('express');
var fs = require('fs');
var request = require('request');
var app = express();

app.get('/api', function (req, res) {
	// get url query vars and pass to scraper
	
	
});

app.listen('8081');

console.log('Server running on port 8081');

exports = module.exports = app;