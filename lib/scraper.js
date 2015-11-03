// Place wiki quotes related functions here
var scraper = function () {}

scraper.prototype.cleanQuote = function (quote) {
	// Cleans quote for optimal searching 

	return cleanedQuote;
} 
scraper.prototype.cleanName = function (authorName) {
	// Cleans name for optimal searching
	return cleanedName;
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