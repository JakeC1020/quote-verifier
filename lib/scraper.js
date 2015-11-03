// Place wiki quotes related functions here
var scraper = function () {}

scraper.prototype.cleanQuote = function (quote) {
	// Cleans quote for optimal searching 

	return cleanedQuote;
} 
scraper.prototype.cleanName = function (authorName) {
	// Cleans name for optimal searching
	// Makes name lower case, replaces spaces with underscores, and removes any weird characters (%$#, numbers, etc.)
	var cleanedAuthor = "";
	var chr = '';
	for (i=0;i<authorName.length;i++) {
		chr = authorName[i].toLowerCase();
		if (chr == " ") {
			cleanedAuthor += "_";
		}
		else if (chr >= 'a' && chr <= 'z') {
			cleanedAuthor += chr;
		}
		else {
			// do nothing since not a letter or space (in other words, removes weird characters)
		}
	}
	return cleanedAuthor;
}

scraper.prototype.manageInput = function (queryVars) {
	// Returns object with same keys and cleaned up values
	var cleanName = this.cleanName(queryVars.)
	var cleanQuote = this.cleanQuote(queryVars.);
	

	callback(null, cleanName, cleanQuote);
}

scraper.prototype.scrape = function(cleanName, cleanQuote, callback) {
	// This is gonna be a pretty big function. If it gets too big we can refactor 
	// to add another step in the waterfall
	if (false) {
		// something went wrong
		callback(true, cleanName, cleanQuote, quoteArray);
	}
	else {
		// everthing went right 
		callback(null, cleanName, cleanQuote, quoteArray);
	}
}

scraper.prototype.calcAuthenticity = function(cleanName, cleanQuote, quoteObject) {
	// Searches for quote, determines legitimacy of the quote
	// Also probably a big function, we can refactor if needed
	var authorPresent = false;
	var quotePresent = false;
	var misattributed = false;
	var disputed = false; 
	var authenticity, message;

	// Search quotes
	if (quoteObject.quotes.length() > 0) {
		// The author had results, search them for desired quote
		authorPresent = true;

		// search quotes
		var i = 0;
		while ( i < quoteObject.quotes.length() && !quotePresent) {
			if (cleanQuote == quoteObject[i]) {
				quotePresent = true;
			}
			i++;
		}

		// search disputed
		var i = 0;
		while ( i < quoteObject.disputed.length() && !disputed) {
			if (cleanQuote == quoteObject.disputed[i]) {
				disputed = true;
			}
			i++;
		}

		// search misattributed
		var i = 0;
		while ( i < quoteObject.misattributed.length() && !misattributed) {
			if (cleanQuote == quoteObject.misattributed[i]) {
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