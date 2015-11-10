var request = require('request');
var cheerio = require('cheerio');

// Place wiki quotes related functions here
var scraper = function () {
	scraperObject = this;
}

scraper.prototype.cleanQuote = function (quote) {
	// Cleans quote for optimal searching 
	// trim() removes spaces before and end of string
	cleanedQuote = quote.trim();
	return cleanedQuote;
} 

scraper.prototype.cleanName = function (authorName) {
	// Cleans name for optimal searching
	// Makes first letter of first/last name upper case and the rest lower case
	// replaces spaces with underscores and removes any weird characters (%$#, numbers, etc.)
	var cleanedAuthor = "";
	var chr = '';

	authorName = authorName.toLowerCase();
	authorName = authorName.replace(/\b./g, function(m){ return m.toUpperCase(); });

	for (i=0;i<authorName.length;i++) {
		chr = authorName[i];
		
		if (chr == " ") {
			cleanedAuthor += "_";
		}
		else if ((chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z')) {
			cleanedAuthor += chr;
		}
		else {
			// do nothing since not a letter or space (in other words, removes weird characters)
		}
	}
	return cleanedAuthor;
}

scraper.prototype.manageInput = function (queryVars, callback) {
	// Returns object with same keys and cleaned up values
	var cleanName = scraperObject.cleanName(queryVars.author)
	var cleanQuote = scraperObject.cleanQuote(queryVars.quote);
	

	callback(null, cleanName, cleanQuote);
}

scraper.prototype.scrape = function(cleanName, cleanQuote, callback) {
	// This is gonna be a pretty big function. If it gets too big we can refactor 
	// to add another step in the waterfall
	var found = false;
	var pageExist = false;
	var bgColor;

	wikiURL = "https://en.wikiquote.org/wiki/" + cleanName;
	console.log(wikiURL)
	request(wikiURL, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("No error");
			// Removes line breakes from HTML (some quotes have \n in non-predictable places)
			cleanBody = body.replace(/\n/g,'').toLowerCase()
			$ = cheerio.load(cleanBody);
			if ($("*:contains(Wikiquote does not have an article with this exact name.)").length == 0) {
				pageExist = true;
				console.log("Page exists");
				console.log(cleanQuote);
				if ($("*:contains("+cleanQuote+")").length > 0) {
					console.log("Found")
					var found = true;
					// Loops through each parent and if it has a background color, it sets bgColor to it (used for disputed/misattirbuted identification)
					$("*:contains("+cleanQuote+")").parents().each(function() {
						if ($(this).css("background-color") !== undefined) {
							bgColor = $(this).css("background-color");
						}
					});
				}
			}
			else {
				pageExist = false;
			}
		}
		if (false) {
		// something went wrong
		callback(true, cleanName, cleanQuote, found, bgColor, pageExist);
		}
		else {
			// everthing went right 
			console.log(found + " " + bgColor + " " + pageExist);
			callback(null, cleanName, cleanQuote, found, bgColor, pageExist);
		}
	});
	
}

scraper.prototype.calcAuthenticity = function(cleanName, cleanQuote, found, bgColor, pageExist, callback) {
	var authenticity, message;

	if (bgColor === "#FCFCCC") {
		authenticity = "False";
		message = "We found this quote listed in the given author's misattributed section. Click on the link to the Wikiquote page for more info.";
	}
	else if (bgColor === "#FFE7CC") {
		authenticity = "Unable to be determined"
		message = "We found this quote listed in the given author's disputed section. You may want to consider further research, or click on the link to the Wikiquote page for more info.";
	}
	else if (pageExist && !found) {
		authenticity = "Most likely false";
		message = "We couldn't find the quote listed on the given author's Wikiquote page.";
	}
	else if (!pageExist) {
		authenticity = "Unable to be determined";
		message = "We couldn't find the given author in the Wikiquote archive. You may want to consider further research.";
	}
	else if (found) {
		authenticity = "True";
		message = "We found this quote listed on the Wikiquote page for the given author";
	}

	objectResults = {
		"Error": "null",
		"Author Name": cleanName,
		"Quote": cleanQuote,
		"Authenticity": authenticity,
		"Message": message
	}

	jsonResults = JSON.stringify(objectResults);
	if (false) {
		// something went wrong
		callback(true, jsonResults);
	}
	else {
		// Everything went ok
		callback(null, jsonResults);
	}
}

module.exports = new scraper();

/*
scraper.prototype.calcAuthenticity = function(cleanName, cleanQuote, quoteObject, callback) {
	// Searches for quote, determines legitimacy of the quote
	// Also probably a big function, we can refactor if needed
	var authorPresent = false;
	var quotePresent = false;
	var misattributed = false;
	var disputed = false; 
	var authenticity, message;

	// Search quotes
	if (quoteObject.quotes.length > 0) {
		// The author had results, search them for desired quote
		authorPresent = true;

		// search quotes
		var i = 0;
		while ( i < quoteObject.quotes.length && !quotePresent) {
			if (cleanQuote === quoteObject.quotes[i]) {
				quotePresent = true;
			}
			i++;
		}

		// search disputed
		var i = 0;
		while ( i < quoteObject.disputed.length && !disputed) {
			if (cleanQuote === quoteObject.disputed[i]) {
				disputed = true;
			}
			i++;
		}

		// search misattributed
		var i = 0;
		while ( i < quoteObject.misattributed.length && !misattributed) {
			if (cleanQuote === quoteObject.misattributed[i]) {
				misattributed = true;
			}
			i++;
		}
	}
	// Determinte authenticity and assign message

	if (misattributed) { 
		authenticity = "False";
		message = "We found this quote listed in the given author's misattributed section. Click on the link to the Wikiquote page for more info.";
	}
	else if (authorPresent && !quotePresent) {
		authenticity = "Most likely false";
		message = "We couldn't find the quote listed on the given author's Wikiquote page."
	}
	else if (!authorPresent) {
		authenticity = "Unable to be determined";
		message = "We couldn't find the given author in the Wikiquote archive. You may want to consider further research.";
	}
	else if (disputed) {
		authenticity = "Unable to be determined";
		message = "We found this quote listed in the given author's disputed section. You may want to consider further research, or click on the link to the Wikiquote page for more info.";
	}
	else if (quotePresent) {
		authenticity = "True";
		message = "We found this quote listed on the Wikiquote page for the given author."
	}

	// Package up the JSON and send it off

	objectResults = {
		"Error": "null",
		"Author Name": cleanName,
		"Quote": cleanQuote,
		"Authenticity": authenticity,
		"Message": message
	}

	jsonResults = JSON.stringify(objectResults);
	if (false) {
		// something went wrong
		callback(true, jsonResults);
	}
	else {
		// Everything went ok
		callback(null, jsonResults);
	}
}
*/
