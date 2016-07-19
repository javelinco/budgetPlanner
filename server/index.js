var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var uuid = require('node-uuid');

var budgetItems = [];

app.use(bodyParser.json({verify:function(req,res,buf){req.rawBody=buf;}}));

app.get('/api/v1/budgetItems', function (req, res) {
	res.end(JSON.stringify(budgetItems, null, 2));
});

app.post('/api/v1/budgetItem', function (req, res) {
	var incoming = req.body;

	var result = budgetItems.filter(function (budgetItem) {
		return budgetItem.BudgetItemId === incoming.BudgetItemId;
	})[0];

	if (!result) {
		incoming.BudgetItemId = uuid.v4();
		budgetItems.push(incoming);
	}

	res.json(200);
});

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("budgetPlanner listening at http://%s:%s", host, port);
});
