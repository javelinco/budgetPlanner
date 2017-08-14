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
      "accounts": [],
      "ledgerItems": [],
      "selectedMonth": moment().toISOString(),
      "selectedAccountId": "65e05f87-188c-468a-a364-dbc8acd56b69"
    };
  }

  getAccountId(selectedAccountName, accounts) {
    var account = accounts.find(function(account) {
        return (account.name === selectedAccountName);
    });
    if (account) {
      return account.accountId;
    } else {
      return null;
    }
  }

  getAccountName(selectedAccountId, accounts) {
    var account = accounts.find(function(account) {
      return (account.accountId === selectedAccountId);
    });
    if (account) {
      return account.name;
    } else {
      return null;
    }
  }

  componentDidMount = () => {
      this.fetchAccounts(this);
      this.fetchLedgerItems(this, this.state.selectedAccountId, this.state.selectedMonth);
  }

  fetchAccounts = (that) => {
    fetch("http://localhost:8081/api/v1/accounts")
    .then(function(response) {
      if (response.status !== 200) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      that.setState({
        "accounts": data,
        "ledgerItems": that.state.ledgerItems,
        "selectedMonth": that.state.selectedMonth,
        "selectedAccountId": that.state.selectedAccountId
      });
    });
  }

  fetchLedgerItems = (that, selectedAccountId, selectedMonth) => {
    var momentMonth = moment(selectedMonth);
    fetch("http://localhost:8081/api/v1/ledgerItems/" + selectedAccountId + "/" + momentMonth.format("YYYY") + "/" + momentMonth.format("MM"))
      .then(function(response) {
        if (response.status !== 200) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          "accounts": that.state.accounts,
          "ledgerItems": data,
          "selectedMonth": that.state.selectedMonth,
          "selectedAccountId": selectedAccountId
        });
      });
  }

  handleMonthChange = (selectedMonth) => {
    this.setState({
      "accounts": this.state.accounts,
      "ledgerItems": this.state.ledgerItems,
      "selectedMonth": moment(selectedMonth).toISOString(),
      "selectedAccountId": this.state.selectedAccountId
    }, this.fetchLedgerItems(this, this.state.selectedAccountId, selectedMonth));
  }

  handleAccountChange = (selectedAccountName) => {
    var selectedAccountId = this.getAccountId(selectedAccountName, this.state.accounts);
    this.setState({
      "accounts": this.state.accounts,
      "ledgerItems": this.state.ledgerItems,
      "selectedMonth": this.state.selectedMonth,
      "selectedAccountId": selectedAccountId
    }, this.fetchLedgerItems(this, selectedAccountId, this.state.selectedMonth));
  }

  render() {
    const accounts = this.state.accounts;
    const selectedAccountId = this.state.selectedAccountId;
    const selectedAccountName = this.getAccountName(this.state.selectedAccountId, accounts);
    const selectedMonth = this.state.selectedMonth;
    const ledgerItems = this.state.ledgerItems;

    return (
      <div className="container account">
        <AccountSelector accounts={accounts} selectedAccountName={selectedAccountName} onAccountChange={this.handleAccountChange} />
        <MonthSelector selectedMonth={selectedMonth} onMonthSelect={this.handleMonthChange} />
        <Balance ledgerItems={ledgerItems} selectedMonth={selectedMonth} selectedAccountId={selectedAccountId} />
        <LedgerList ledgerItems={ledgerItems} selectedMonth={selectedMonth} selectedAccountId={selectedAccountId} />
      </div>
    )
  }
}

class AccountSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "accounts": this.buildAccountOptions(this.props.accounts)
    };
  }

  selectAccount = (event) => {
    this.props.onAccountChange(event.target.value);
    event.preventDefault();
  }

  buildAccountOptions(accounts) {
    var accountOptions = [];
    accounts.forEach((account) => {
      accountOptions.push(<option key={account.accountId}>{account.name}</option>);
    });
    return accountOptions;
  }

  render() {
    const accountOptions = this.buildAccountOptions(this.props.accounts);
    const selectedAccountName = this.props.selectedAccountName;

    return (
      <div className="accountSelector">
          <span className="bold">Account:</span> <select onChange={this.selectAccount} defaultValue={selectedAccountName}>{accountOptions}</select>
      </div>
    )
  }
}

class Balance extends React.Component {
  buildState = (props) => {
    var currentMonth = moment(this.props.selectedMonth);
    var previousMonth = moment(currentMonth).add(-1, 'month');
    var previousMonthBalance = this.props.ledgerItems.reduce((accumulator, ledgerItem) => {
        return (moment(ledgerItem.date).isSame(previousMonth, 'month'))
          ? accumulator + ledgerItem.amount
          : accumulator;
      }, 0);

    return {
      "previousMonthBalance": previousMonthBalance,
      "endMonthBalance": this.props.ledgerItems.reduce((accumulator, ledgerItem) => {
          return (moment(ledgerItem.date).isSame(currentMonth, 'month')
            && ledgerItem.accountId === this.props.selectedAccountId)
            ? accumulator + ledgerItem.amount
            : accumulator;
        }, previousMonthBalance),
      "clearedBalance": this.props.ledgerItems.reduce((accumulator, ledgerItem) => {
          return (moment(ledgerItem.date).isSame(currentMonth, 'month')
            && ledgerItem.cleared
            && ledgerItem.accountId === this.props.selectedAccountId)
            ? accumulator + ledgerItem.amount
            : accumulator;
        }, previousMonthBalance),
      "currentBalance": this.props.ledgerItems.reduce((accumulator, ledgerItem) => {
          return (moment(ledgerItem.date).isSame(currentMonth, 'month')
            && moment(ledgerItem.date).isSameOrBefore(currentMonth, 'date')
            && ledgerItem.accountId === this.props.selectedAccountId)
            ? accumulator + ledgerItem.amount
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

class LedgerList extends React.Component {
  buildState = (props) => {
    var selectedMonthLedgerItems = [];
    this.props.ledgerItems.forEach((ledgerItem) => {
      if (moment(ledgerItem.date).isSame(this.props.selectedMonth, 'month')
            && ledgerItem.accountId === this.props.selectedAccountId) {
        selectedMonthLedgerItems.push(<LedgerItem key={ledgerItem.ledgerItemId} date={ledgerItem.date} category={ledgerItem.category} description={ledgerItem.description} cleared={ledgerItem.cleared} amount={ledgerItem.amount} />);
      }
    });

    return {
      "selectedMonthLedgerItems": selectedMonthLedgerItems
    };
  }

  render() {
    const state = this.buildState(this.props);

    const selectedMonthLedgerItems = state.selectedMonthLedgerItems;

    return (
      <div className="itemList">
          <p className="itemListHeader bold">
              <span className="itemListDate" title="Date">Date</span>
              <span className="itemListCategory" title="Category">Category</span>
              <span className="itemListDescription" title="Description">Description</span>
              <span className="itemListCleared" title="C">C</span>
              <span className="itemListAmount" title="Amount">Amount</span>
          </p>
          {selectedMonthLedgerItems}
      </div>    
    )
  }
}

function LedgerItem(props) {
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