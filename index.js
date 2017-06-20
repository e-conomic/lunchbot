var express = require('express')
var app = express()
var lunch = require('./lunch.js')
var botkit = require('botkit')
var bodyParser = require('body-parser')
var request = require('request')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	lunch.today((lunch, err) => {
		if (err) {
			console.log("Error: " + err)
			res.status(500).send(err)
			return
		}

		res.send(lunch)
	})
})

app.get('/:weekday', (req, res) => {
	let weekday = req.params['weekday']
	let weekdayNumber = weekdayMapping[weekday.toLowerCase()]

	if (!weekdayNumber) {
		console.log("Unknown weekday: " + weekday)
		res.status(500)
		return
	}

	lunch.forDay(weekdayNumber, (lunch, err) => {
		if (err) {
			console.log("Error: " + err)
			res.status(500).send(err)
			return
		}

		res.send(lunch)
	})
})

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
	console.log("Running on port " + app.get('port'))
})

var weekdayMapping = {
	'monday': 1,
	'tuesday': 2,
	'wednesday': 3,
	'thursday': 4,
	'friday': 5
}

app.post('/slack/slash/lunch', (req, res) => {
	console.log(req.body)

	if (req.body['token'] != process.env.SLACK_SLASH_LUNCH) {
		res.send()
		return
	}

	var cb = (lunch, err) => {
		if (err) {
			console.log("Error: " + err)
			return
		}

		request({
			method: 'POST',
			uri: req.body['response_url'],
			json: {
				response_type: "in_channel",
				text: lunch.main,
				attachments: [{
					text: lunch.side
				}]
			}
		})
	}

	var text = req.body['text']

	if (text) {
		var weekdayNumber = weekdayMapping[text.toLowerCase()]

		if (weekdayNumber) {
			console.log("1 " + weekdayNumber)
			lunch.forDay(text, cb)
		}
	} else {
		lunch.today(cb)
	}

	res.send()
})
