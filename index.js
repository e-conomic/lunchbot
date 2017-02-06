var express = require('express')
var app = express()
var lunch = require('./lunch.js')

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

var port = process.env.PORT | 3000
app.listen(port, function() {
	console.log("Running on port " + port)
})
