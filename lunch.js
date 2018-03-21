const request = require('request')
const cheerio = require('cheerio')
const zpad = require('zpad')
const currentWeekNumber = require('current-week-number')

const mainQuery = "div.element.title"
const sideQuery = "div.element.description"

const cachedLunch = {}

function buildCacheKey(weekNumber, weekdayNumber) {
	return `${weekNumber}-${weekdayNumber}`
}

function today() {
	const date = new Date()
	const weekdayNumber = date.getDay()

	return forDay(weekdayNumber)
}

function forDay(weekdayNumber) {
	const weekNumber = currentWeekNumber()
	const cacheKey = buildCacheKey(weekNumber, weekdayNumber)
	const fromCache = cachedLunch[cacheKey]

	if (fromCache) {
		console.log("Cache hit")
		return Promise.resolve(fromCache)
	} else {
		return new Promise((resolve, reject) => {
			request('http://dk428.eurest.dk/k-benhavn/da/ugemenu', (err, res, body) => {
				const $ = cheerio.load(body)
				const mains = $(mainQuery)
				const sides = $(sideQuery)
				const mainData = mains[weekdayNumber - 1].children[0]
				const sideData = sides[weekdayNumber - 1].children[0]
				const lunch = {}

				if (mainData) {
					lunch['main'] = mainData.data.trim()
				}
				if (sideData) {
					lunch['side'] = sideData.data.trim()
				}

				cachedLunch[cacheKey] = lunch
				resolve(lunch)
			})
		})
	}
}

module.exports = {
	today: today,
	forDay: forDay
}
