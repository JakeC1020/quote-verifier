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

scraper.prototype.calcAuthenticity = function(cleanName, cleanQuote, quoteArray) {
	// Searches for quote, determines legitimacy of the quote
	// Also probably a big function, we can refactor if needed

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