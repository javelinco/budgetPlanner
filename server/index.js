var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var uuid = require("uuid/v4");
var moment = require("moment");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081

var router = express.Router();

router.use(function(req, res, next) {
	this.corsWhiteList(res);

	next();
})

router.get("/accounts", function(req, res) {
	res.end(JSON.stringify(accounts, null, 2));
});

router.get("/budgetItems", function(req, res) {
	res.end(JSON.stringify(budgetItems, null, 2));
});

router.post("/budgetItem", function(req, res) {
	var incoming = req.body;

	var result = budgetItems.filter(function (budgetItem) {
		return budgetItem.budgetItemId === incoming.budgetItemId;
	})[0];

	if (!result) {
		incoming.budgetItemId = uuid();
		budgetItems.push(incoming);
	}

	res.json(200);
});

router.get("/ledgerItems/:accountId", function(req, res) {
	var accountLedgerItems = ledgerItems.filter(function(ledgerItem) {
		return (ledgerItem.accountId === req.params.accountId);
	});
	res.end(JSON.stringify(accountLedgerItems, null, 2));
});

router.get("/ledgerItems/:accountId/:year/:month", function(req, res) {
	var selectedMonth = moment(req.params.year + "-" + req.params.month + "-01T00:00:00.000-08:00");
	var previousMonth = moment(selectedMonth).subtract(1, "months");
	var accountLedgerItems = ledgerItems.filter(function(ledgerItem) {
		var ledgerDate = moment(ledgerItem.date);
		return (ledgerItem.accountId === req.params.accountId
			&& (ledgerDate.isSame(selectedMonth, "month")
			|| ledgerDate.isSame(previousMonth, "month")));
	});
	res.end(JSON.stringify(accountLedgerItems, null, 2));
});

app.use("/api/v1", router);

app.listen(port);
console.log("budgetPlannerApi listening at http://localhost:%s", port);

corsWhiteList = (res) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Credentials", true);
}

var accounts = [
	{ "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69", "name": "Checking" },
	{ "accountId": "090e4960-df87-48b5-9a65-746c244be206", "name": "Visa" }
];
var budgetItems = [];
var ledgerItems = [
	{
	  "ledgerItemId": "247fbfd0-be07-44d3-81b5-35407c7bb667",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-07-01T00:00:00.000-08:00").toISOString(),
	  "category": "Mortgage",
	  "description": "U.S. Bank Mortgage",
	  "cleared": true,
	  "amount": -2300.00
	},
	{
	  "ledgerItemId": "9c58ebcc-6c25-47d3-a400-37f7a628ffe1",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-07-03T00:00:00.00-08:00").toISOString(),
	  "category": "Bank Charge",
	  "description": "U.S. Bank",
	  "cleared": true,
	  "amount": -5.95
	},
	{
	  "ledgerItemId": "4b3aec93-9b80-4283-90a3-a1022fcadb38",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-07-23T00:00:00.00-08:00").toISOString(),
	  "category": "Paycheck",
	  "description": "Employer Name",
	  "cleared": true,
	  "amount": 2400.00
	},
	{
	  "ledgerItemId": "86f3d1a5-21c0-4104-8171-2e6f7c49acbb",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-08-01T00:00:00.000-08:00").toISOString(),
	  "category": "Mortgage",
	  "description": "U.S. Bank Mortgage",
	  "cleared": true,
	  "amount": -2300.00
	},
	{
	  "ledgerItemId": "260ec1b1-ebea-4161-ae11-f3504c3b9ee9",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-08-01T00:00:00.000-08:00").toISOString(),
	  "category": "Bank Charge",
	  "description": "U.S. Bank",
	  "cleared": false,
	  "amount": -5.95
	},
	{
	  "ledgerItemId": "e225b1ec-d86f-4cbd-94fe-c251163ece47",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-08-04T00:00:00.00-08:00").toISOString(),
	  "category": "Bill Consolidation",
	  "description": "Making it overflow on purpose, to see what happens with property",
	  "cleared": false,
	  "amount": 153.00
	},
	{
	  "ledgerItemId": "5541bb6a-ae7f-4f0a-96d3-84329c92f3b1",
	  "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
	  "date": moment("2017-08-23T00:00:00.00-08:00").toISOString(),
	  "category": "Paycheck",
	  "description": "Employer Name",
	  "cleared": false,
	  "amount": 2400.00
	},
	{
	  "ledgerItemId": "013bd523-d109-4968-8e8a-c5d3b061acea",
	  "accountId": "090e4960-df87-48b5-9a65-746c244be206",
	  "date": moment("2017-08-07T00:00:00.00-08:00").toISOString(),
	  "category": "Haircut",
	  "description": "HairM",
	  "cleared": true,
	  "amount": -25.00
	},
	{
	  "ledgerItemId": "01dfe563-1c81-43b8-b6be-9f8851aee97e",
	  "accountId": "090e4960-df87-48b5-9a65-746c244be206",
	  "date": moment("2017-08-11T00:00:00.00-08:00").toISOString(),
	  "category": "Natural Gas",
	  "description": "NW Natural",
	  "cleared": true,
	  "amount": -20.62
	}
];