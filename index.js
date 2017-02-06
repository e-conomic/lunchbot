var express = require('express')
var app = express()
var lunch = require('./lunch.js')
var botkit = require('botkit')

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
	token: 'xoxb-136922031585-9HuIoAyzSjqg6TEiIykQvS5z',
}).startRTM()

// give the bot something to listen for.
controller.hears('lunch',['direct_message','direct_mention','mention'], function(bot,message) {
	lunch.today(function (lunch, err) {
		if (err) {
			console.log("Error: " + err)
			bot.reply(message, "Could not grap lunch info :/")
			return
		}

		bot.reply(message, lunch.main + " | " + lunch.side);
	})
});
