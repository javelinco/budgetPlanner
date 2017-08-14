import React from 'react';
var moment = require('moment');

function FormatCurrency(amount) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(amount);
}

export default class AccountLedger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "accounts": [
        { "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69", "name": "Checking" },
        { "accountId": "090e4960-df87-48b5-9a65-746c244be206", "name": "Visa" }
      ],
      "budgetItems": [
        {
          "budgetItemId": "247fbfd0-be07-44d3-81b5-35407c7bb667",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-07-01T00:00:00.000-08:00").toISOString(),
          "category": "Mortgage",
          "description": "U.S. Bank Mortgage",
          "cleared": true,
          "amount": -2300.00
        },
        {
          "budgetItemId": "9c58ebcc-6c25-47d3-a400-37f7a628ffe1",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-07-03T00:00:00.00-08:00").toISOString(),
          "category": "Bank Charge",
          "description": "U.S. Bank",
          "cleared": true,
          "amount": -5.95
        },
        {
          "budgetItemId": "4b3aec93-9b80-4283-90a3-a1022fcadb38",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-07-23T00:00:00.00-08:00").toISOString(),
          "category": "Paycheck",
          "description": "Employer Name",
          "cleared": true,
          "amount": 2400.00
        },
        {
          "budgetItemId": "86f3d1a5-21c0-4104-8171-2e6f7c49acbb",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-08-01T00:00:00.000-08:00").toISOString(),
          "category": "Mortgage",
          "description": "U.S. Bank Mortgage",
          "cleared": true,
          "amount": -2300.00
        },
        {
          "budgetItemId": "260ec1b1-ebea-4161-ae11-f3504c3b9ee9",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-08-01T00:00:00.000-08:00").toISOString(),
          "category": "Bank Charge",
          "description": "U.S. Bank",
          "cleared": false,
          "amount": -5.95
        },
        {
          "budgetItemId": "e225b1ec-d86f-4cbd-94fe-c251163ece47",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-08-04T00:00:00.00-08:00").toISOString(),
          "category": "Bill Consolidation",
          "description": "Making it overflow on purpose, to see what happens with property",
          "cleared": false,
          "amount": 153.00
        },
        {
          "budgetItemId": "5541bb6a-ae7f-4f0a-96d3-84329c92f3b1",
          "accountId": "65e05f87-188c-468a-a364-dbc8acd56b69",
          "date": moment("2017-08-23T00:00:00.00-08:00").toISOString(),
          "category": "Paycheck",
          "description": "Employer Name",
          "cleared": false,
          "amount": 2400.00
        },
        {
          "budgetItemId": "013bd523-d109-4968-8e8a-c5d3b061acea",
          "accountId": "090e4960-df87-48b5-9a65-746c244be206",
          "date": moment("2017-08-07T00:00:00.00-08:00").toISOString(),
          "category": "Haircut",
          "description": "HairM",
          "cleared": true,
          "amount": -25.00
        },
        {
          "budgetItemId": "01dfe563-1c81-43b8-b6be-9f8851aee97e",
          "accountId": "090e4960-df87-48b5-9a65-746c244be206",
          "date": moment("2017-08-11T00:00:00.00-08:00").toISOString(),
          "category": "Natural Gas",
          "description": "NW Natural",
          "cleared": true,
          "amount": -20.62
        }
      ],
      "selectedMonth": moment().toISOString(),
      "selectedAccountId": "65e05f87-188c-468a-a364-dbc8acd56b69"
    };
  }


  getAccountId(selectedAccountName, accounts) {
    return accounts.find(function(account) {
        return (account.name === selectedAccountName);
    }).accountId
  }

  getAccountName(selectedAccountId, accounts) {
    return accounts.find(function(account) {
        return (account.accountId === selectedAccountId);
    }).name
  }

  handleMonthChange = (selectedMonth) => {
    this.setState({
      "accounts": this.state.accounts,
      "budgetItems": this.state.budgetItems,
      "selectedMonth": moment(selectedMonth).toISOString(),
      "selectedAccountId": this.state.selectedAccountId
    });
  }

  handleAccountChange = (selectedAccountName) => {
    var selectedAccountId = this.getAccountId(selectedAccountName, this.state.accounts);
    this.setState({
      "accounts": this.state.accounts,
      "budgetItems": this.state.budgetItems,
      "selectedMonth": this.state.selectedMonth,
      "selectedAccountId": selectedAccountId
    });
  }

  render() {
    const accounts = this.state.accounts;
    const selectedAccountId = this.state.selectedAccountId;
    const selectedAccountName = this.getAccountName(this.state.selectedAccountId, accounts);
    const selectedMonth = this.state.selectedMonth;
    const budgetItems = this.state.budgetItems;

    return (
      <div className="container account">
        <AccountSelector accounts={accounts} selectedAccountName={selectedAccountName} onAccountChange={this.handleAccountChange} />
        <MonthSelector selectedMonth={selectedMonth} onMonthSelect={this.handleMonthChange} />
        <Balance budgetItems={budgetItems} selectedMonth={selectedMonth} selectedAccountId={selectedAccountId} />
        <BudgetList budgetItems={budgetItems} selectedMonth={selectedMonth} selectedAccountId={selectedAccountId} />
      </div>
    )
  }
}

class AccountSelector extends React.Component {
  constructor(props) {
    super(props);

    var accounts = [];
    this.props.accounts.forEach((account) => {
      accounts.push(<option key={account.accountId}>{account.name}</option>);
    });
    this.state = {
      "accounts": accounts
    };
  }

  selectAccount = (event) => {
    this.props.onAccountChange(event.target.value);
    event.preventDefault();
  }

  render() {
    const accounts = this.state.accounts;
    const selectedAccountName = this.props.selectedAccountName;

    return (
      <div className="accountSelector">
          <span className="bold">Account:</span> <select onChange={this.selectAccount} defaultValue={selectedAccountName}>{accounts}</select>
      </div>
    )
  }
}

class Balance extends React.Component {
  buildState = (props) => {
    var previousMonth = moment(this.props.selectedMonth).add(-1, 'month')
    var currentMonth = moment(this.props.selectedMonth);
    var previousMonthBalance = this.props.budgetItems.reduce((accumulator, budgetItem) => {
        return (moment(budgetItem.date).isSame(previousMonth, 'month'))
          ? accumulator + budgetItem.amount
          : accumulator;
      }, 0);

    return {
      "previousMonthBalance": previousMonthBalance,
      "endMonthBalance": this.props.budgetItems.reduce((accumulator, budgetItem) => {
          return (moment(budgetItem.date).isSame(currentMonth, 'month')
            && budgetItem.accountId === this.props.selectedAccountId)
            ? accumulator + budgetItem.amount
            : accumulator;
        }, previousMonthBalance),
      "clearedBalance": this.props.budgetItems.reduce((accumulator, budgetItem) => {
          return (moment(budgetItem.date).isSame(currentMonth, 'month')
            && budgetItem.cleared
            && budgetItem.accountId === this.props.selectedAccountId)
            ? accumulator + budgetItem.amount
            : accumulator;
        }, previousMonthBalance),
      "currentBalance": this.props.budgetItems.reduce((accumulator, budgetItem) => {
          return (moment(budgetItem.date).isSame(currentMonth, 'month')
            && moment(budgetItem.date).isSameOrBefore(currentMonth, 'date')
            && budgetItem.accountId === this.props.selectedAccountId)
            ? accumulator + budgetItem.amount
            : accumulator;
        }, previousMonthBalance)
    };
  }

  render() {
    const state = this.buildState(this.props);

    const previousMonthBalance = state.previousMonthBalance;
    const endMonthBalance = state.endMonthBalance;
    const clearedBalance = state.clearedBalance;
    const currentBalance = state.currentBalance;

    return (
      <div className="balance">
          <p><span className="bold">Balance:</span></p>
          <p>
              <span className="balanceColumn"><span className="bold" title={FormatCurrency(previousMonthBalance)}>Previous:</span> <span className="balanceAmount">{FormatCurrency(previousMonthBalance)}</span></span>
              <span className="balanceColumn"><span className="bold" title={FormatCurrency(endMonthBalance)}>Month:</span> <span className="balanceAmount">{FormatCurrency(endMonthBalance)}</span></span>
          </p>
          <p>
              <span className="balanceColumn"><span className="bold" title={FormatCurrency(clearedBalance)}>Cleared:</span> <span className="balanceAmount">{FormatCurrency(clearedBalance)}</span></span>
              <span className="balanceColumn"><span className="bold" title={FormatCurrency(currentBalance)}>Current:</span> <span className="balanceAmount">{FormatCurrency(currentBalance)}</span></span>
          </p>
      </div>
    )
  }
}

class BudgetList extends React.Component {
  buildState = (props) => {
    var selectedMonthBudgetItems = [];
    this.props.budgetItems.forEach((budgetItem) => {
      if (moment(budgetItem.date).isSame(this.props.selectedMonth, 'month')
            && budgetItem.accountId === this.props.selectedAccountId) {
        selectedMonthBudgetItems.push(<BudgetItem key={budgetItem.budgetItemId} date={budgetItem.date} category={budgetItem.category} description={budgetItem.description} cleared={budgetItem.cleared} amount={budgetItem.amount} />);
      }
    });

    return {
      "selectedMonthBudgetItems": selectedMonthBudgetItems
    };
  }

  render() {
    const state = this.buildState(this.props);

    const selectedMonthBudgetItems = state.selectedMonthBudgetItems;

    return (
      <div className="itemList">
          <p className="itemListHeader bold">
              <span className="itemListDate" title="Date">Date</span>
              <span className="itemListCategory" title="Category">Category</span>
              <span className="itemListDescription" title="Description">Description</span>
              <span className="itemListCleared" title="C">C</span>
              <span className="itemListAmount" title="Amount">Amount</span>
          </p>
          {selectedMonthBudgetItems}
      </div>    
    )
  }
}

function BudgetItem(props) {
  return (
    <p className="itemListRow">
        <span className="itemListDate" title={props.date}>{moment(props.date).format("MM/DD/YYYY")}</span>
        <span className="itemListCategory" title={props.category}>{props.category}</span>
        <span className="itemListDescription" title={props.description}>{props.description}</span>
        <span className="itemListCleared" title={props.cleared}><input type="checkbox" defaultChecked={props.cleared} /></span>
        <span className="itemListAmount" title={FormatCurrency(props.amount)}>{FormatCurrency(props.amount)}</span>
    </p>
  )
}

class MonthSelector extends React.Component {
  selectMonth = (event) => {
    this.props.onMonthSelect(event.target.value);
    event.preventDefault();
  }

  render() {
    const selectedMonth = moment(this.props.selectedMonth).format("YYYY-MM");

    return (
      <div className="dateSelector"><span className="bold">Month/Year:</span> <input type="month" defaultValue={selectedMonth} onChange={this.selectMonth} /></div>
    )
  }
}