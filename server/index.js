var express = require('express');
var app = express();

var budgetItems = [];

app.get('/api/v1/budgetItems', function (req, res) {
	res.end(JSON.stringify(budgetItems, null, 2));
});

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("budgetPlanner listening at http://%s:%s", host, port);
});
