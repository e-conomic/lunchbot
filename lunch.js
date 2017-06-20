var request = require('request')
var cheerio = require('cheerio')
var zpad = require('zpad')
var currentWeekNumber = require('current-week-number')

let mainQuery = "div.element.title"
let sideQuery = "div.element.description"

var cachedLunch = {}

function buildCacheKey(weekNumber, weekdayNumber) {
	return "" + weekNumber + "-" + weekdayNumber
}

function today(cb) {
	var date = new Date()
	var weekdayNumber = date.getDay()

	forDay(weekdayNumber, cb)
}

function forDay(weekdayNumber, cb) {
	let weekNumber = currentWeekNumber()
	let cacheKey = buildCacheKey(weekNumber, weekdayNumber)
	let fromCache = cachedLunch[cacheKey]

	if (fromCache) {
		console.log("Cache hit")
		cb(fromCache)
	} else {
		request('http://dk428.eurest.dk/k_benhavn/ugemenu', function (err, res, body) {
			let $ = cheerio.load(body)
			let mains = $(mainQuery)
			let sides = $(sideQuery)
			let mainData = mains[weekdayNumber-1].children[0]
			let sideData = sides[weekdayNumber-1].children[0]
			let lunch = {}

			if (mainData) {
				lunch['main'] = mainData.data.trim()
			}
			if (sideData) {
				lunch['side'] = sideData.data.trim()
			}
			cachedLunch[cacheKey] = lunch
			cb(lunch)
		})
	}
}

module.exports = {
	today: today,
	forDay: forDay
}
