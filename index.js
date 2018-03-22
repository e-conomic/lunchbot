const express = require('express')
const app = express()
const lunch = require('./lunch.js')
const bodyParser = require('body-parser')
const request = require('request')

const weekdayMapping = {
	'monday': 1,
	'tuesday': 2,
	'wednesday': 3,
	'thursday': 4,
	'friday': 5
}

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	lunch.today()
		.then(lunch => {
			res.send(lunch)
		})
		.catch(err => {
			console.log("Error: " + err)
			res.status(500).send(err)
		})
})

app.get('/:weekday', (req, res) => {
	const weekday = req.params['weekday']
	const weekdayNumber = weekdayMapping[weekday.toLowerCase()]

	if (!weekdayNumber) {
		console.log("Unknown weekday: " + weekday)
		res.status(500)
		return
	}

	lunch.forDay(weekdayNumber)
		.then(lunch => {
			res.send(lunch)
		})
		.catch(err => {
			console.log("Error: " + err)
			res.status(500).send(err)
		})
})

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
	console.log("Running on port " + app.get('port'))
})

app.post('/slack/slash/lunch', (req, res) => {
	if (req.body['token'] != process.env.SLACK_SLASH_LUNCH) {
		res.send()
		return
	}

	const handler = lunch => {
		request({
			method: 'POST',
			uri: req.body['response_url'],
			json: {
				response_type: "ephemeral",
				text: lunch.main,
				attachments: [{
					text: lunch.side
				}]
			}
		})
	}

	const errorHandler = error => {
		console.log("Error: " + err)
		return
	}

	const text = req.body['text']

	if (text) {
		const weekdayNumber = weekdayMapping[text.toLowerCase()]

		if (weekdayNumber) {
			lunch.forDay(weekdayNumber)
				.then(handler)
				.catch(errorHandler)
		}
	} else {
		lunch.today()
			.then(handler)
			.catch(errorHandler)
	}

	res.send()
})
