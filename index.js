var express = require('express')
var app = express()
var lunch = require('./lunch.js')
var botkit = require('botkit')
var bodyParser = require('body-parser')
var request = require('request')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
	lunch.today(function (lunch, err) {
		if (err) {
			console.log("Error: " + err)
			res.status(500).send(err)
			return
		}

		res.send(lunch)
	})
})

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), function() {
	console.log("Running on port " + app.get('port'))
})

var controller = botkit.slackbot({
	debug: false
	//include "log: false" to disable logging
	//or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
	token: process.env.SLACKBOT_TOKEN,
}).startRTM()

// give the bot something to listen for.
controller.hears('lunch', ['direct_message','direct_mention','mention'], function(bot, message) {
	lunch.today(function (lunch, err) {
		if (err) {
			console.log("Error: " + err)
			bot.reply(message, "Could not grap lunch info :/")
			return
		}

		bot.reply(message, lunch.main + " | " + lunch.side);
	})
});


app.post('/slack/slash/lunch', function (req, res) {
	console.log(req.body)

	if (req.body['token'] != process.env.SLACK_SLASH_LUNCH) {
		res.send()
		return
	}

	lunch.today(function (lunch, err) {
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
	})

	res.send()
})