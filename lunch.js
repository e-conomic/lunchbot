var request = require('request')
var cheerio = require('cheerio')
var zpad = require('zpad')
var currentWeekNumber = require('current-week-number')

function mainQuery(weekNumber, weekdayNumber) {
	return "div#" + zpad(weekNumber) + "-" + weekdayNumber + " .menu-row .row .title span"
}

function sideQuery(weekNumber, weekdayNumber) {
	return "div#" + zpad(weekNumber) + "-" + weekdayNumber + " .menu-row .row .description span"
}

var lastFetchedForWeekdayNumber
var cachedLunch

function today(cb) {
	var date = new Date()
	var weekdayNumber = date.getDay() - 1
	var weekNumber = currentWeekNumber()

	if (lastFetchedForWeekdayNumber != weekdayNumber) {
		request('http://dk428.eurest.dk/k_benhavn/ugemenu', function (err, res, body) {
			var $ = cheerio.load(body)
			var lunch = {
				main: $(mainQuery(weekNumber, weekdayNumber)).text().trim(),
				side: $(sideQuery(weekNumber, weekdayNumber)).text().trim()
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
