var request = require('request')
var cheerio = require('cheerio')

function mainQuery(weekdayNumber) {
	return "div#w06-" + weekdayNumber + " .menu-row .row .title span"
}

function sideQuery(weekdayNumber) {
	return "div#w06-" + weekdayNumber + " .menu-row .row .description span"
}

function getWeekdayNumber() {
	var date = new Date()
	return date.getDay() - 1
}

var lastFetchedForWeekdayNumber
var cachedLunch

function today(cb) {
	var weekdayNumber = getWeekdayNumber()
	if (lastFetchedForWeekdayNumber != weekdayNumber) {
		request('http://dk428.eurest.dk/k_benhavn/ugemenu', function (err, res, body) {
			var $ = cheerio.load(body)
			var weekdayNumber = getWeekdayNumber()
			var lunch = {
				main: $(mainQuery(weekdayNumber)).text().trim(),
				side: $(sideQuery(weekdayNumber)).text().trim()
			}
			lastFetchedForWeekdayNumber = weekdayNumber
			cachedLunch = lunch
			cb(lunch)
		})
	} else {
		cb(cachedLunch)
	}
}

module.exports = {
	today: today
}
