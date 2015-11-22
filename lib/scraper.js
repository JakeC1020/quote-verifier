var request = require('request');
var cheerio = require('cheerio');

// Place wiki quotes related functions here
var Scraper = function () {
	scraperObject = this;
}

Scraper.prototype.cleanQuote = function (quote) {
	// Cleans quote for optimal searching 
	// trim() removes spaces before and end of string
	var cleanedQuote = quote.trim();
	var cleanedQuote = cleanedQuote.toLowerCase();
	return cleanedQuote;
} 

Scraper.prototype.cleanName = function (authorName) {
	// Cleans name for optimal searching
	// Makes first letter of first/last name upper case and the rest lower case
	// replaces spaces with underscores and removes any weird characters (%$#, numbers, etc.)
	var cleanedAuthor = "";
	var chr = '';

	authorName = authorName.toLowerCase();
	authorName = authorName.replace(/\b./g, function(m){ return m.toUpperCase(); });

	for (var i=0;i<authorName.length;i++) {
		chr = authorName[i];
		
		if (chr == " ") {
			cleanedAuthor += "_";
		}
		else if ((chr >= "a" && chr <= "z") || (chr >= "A" && chr <= "Z")) {
			cleanedAuthor += chr;
		}
		// do nothing if not a letter or space (in other words, removes weird characters)
	}
	return cleanedAuthor;
}

Scraper.prototype.manageInput = function (queryVars, callback) {
	// Returns object with same keys and cleaned up values
	var cleanName = scraperObject.cleanName(queryVars.author)
	var cleanQuote = scraperObject.cleanQuote(queryVars.quote);
	

	callback(null, cleanName, cleanQuote);
}

Scraper.prototype.scrape = function(cleanName, cleanQuote, callback) {
	// This is gonna be a pretty big function. If it gets too big we can refactor 
	// to add another step in the waterfall
	var found = false;
	var pageExist = false;
	var bgColor;

	wikiURL = "https://en.wikiquote.org/wiki/" + cleanName;
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	console.log("FECTHING URL: " + wikiURL);
	request(wikiURL, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			// Removes line breaks from HTML (some quotes have \n in non-predictable places)
			cleanBody = body.replace(/\n/g,'').toLowerCase()
			$ = cheerio.load(cleanBody);
			if ($("*:contains(Wikiquote does not have an article with this exact name.)").length === 0) {
				pageExist = true;
				console.log("\nCLEANQUOTE: " + cleanQuote);
				if ($("*:contains("+cleanQuote+")").length > 0) {
					found = true;
					// Loops through each parent and if it has a background color, it sets bgColor to it
					// used for disputed/misattributed identification
					$("*:contains("+cleanQuote+")").parents().each(function() {
						if ($(this).css("background-color") !== undefined) {
							bgColor = $(this).css("background-color");
						}
					});
				};
			}
		}
		else {
			pageExist = false;
		}
		
		console.log("FOUND: " + found + "\nBGCOLOR: " + bgColor + "\nPAGEXIST: " + pageExist + "\n");
		callback(null, cleanName, cleanQuote, found, bgColor, pageExist);
	});
	
}

Scraper.prototype.calcAuthenticity = function(cleanName, cleanQuote, found, bgColor, pageExist, callback) {
	var authenticity, message;

	if (bgColor === "#ffe7cc") {
		authenticity = "False";
		message = "We found this quote listed in the given author's misattributed section. Click on the link to the Wikiquote page for more info.";
	}
	else if (bgColor === "#fcfccc") {
		authenticity = "Unable to be determined"
		message = "We found this quote listed in the given author's disputed section. You may want to consider further research.";
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

	var objectResults = {
		"error": "null",
		"authorName": cleanName,
		"quote": cleanQuote,
		"authenticity": authenticity,
		"message": message,
		"link" : wikiURL
	}

	if (false) {
		// something went wrong
		callback(true, objectResults);
	}
	else {
		// Everything went ok
		callback(null, objectResults);
	}
}

module.exports = new Scraper();
