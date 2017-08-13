import React, { Component } from 'react';
import './css/Main.css';

function FormatCurrency(amount) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(amount);
}

function CheckBox(checked) {
  if (checked === true) {
    return (
      <input type="checkbox" checked="checked" />
    )
  }
  else {
    return (
      <input type="checkbox" />
    )
  }
}

function Account(props) {
  return (
      <div className="container account">
        <AccountSelector />
        <DateSelector />
        <Balance />
        <BudgetList />
      </div>
  )
}

function AccountSelector(props) {
  return (
    <div className="accountSelector">
        <span className="bold">Account:</span> <select>
                <option selected="selected">Checking</option>
                <option>Visa</option>
            </select>
    </div>
  )
}

function Balance(props) {
  return (
    <div className="balance">
        <p><span className="bold">Balance:</span></p>
        <p>
            <span><span className="bold">Previous:</span> $14,204.00</span>
            <span><span className="bold">Month:</span> $15,340.08</span>
        </p>
        <p>
            <span><span className="bold">Cleared:</span> $13,000.00</span>
            <span><span className="bold">Current:</span> $11,588.00</span>
        </p>
    </div>
  )
}

function BudgetList(props) {
  return (
    <div className="itemList">
        <p className="itemListHeader bold">
            <span className="itemListDate" title="Date">Date</span>
            <span className="itemListCategory" title="Category">Category</span>
            <span className="itemListDescription" title="Description">Description</span>
            <span className="itemListCleared" title="C">C</span>
            <span className="itemListAmount" title="Amount">Amount</span>
        </p>
        <BudgetItem date="8/1/2017" category="Mortgage" description="U.S. Bank Mortgage" cleared={true} amount={-2300.00} />
        <BudgetItem date="8/1/2017" category="Bank Charge" description="U.S. Bank" cleared={false} amount={-5.95} />
        <BudgetItem date="8/5/2017" category="Bill Consolidation" description="Making it overflow on purpose, to see what happens with property" cleared={false} amount={153.00} />
    </div>    
  )
}

function BudgetItem(props) {
  return (
    <p className="itemListRow">
        <span className="itemListDate" title={props.date}>{props.date}</span>
        <span className="itemListCategory" title={props.category}>{props.category}</span>
        <span className="itemListDescription" title={props.description}>{props.description}</span>
        <span className="itemListCleared" title={props.cleared}>{CheckBox(props.cleared)}</span>
        <span className="itemListAmount" title={FormatCurrency(props.amount)}>{FormatCurrency(props.amount)}</span>
    </p>
  )
}

function DateSelector(props) {
  return (
    <div className="dateSelector"><span className="bold">Month/Year:</span> <input type="month" /></div>
  )
}

class App extends Component {
  render() {
    return (
      <Account />
    );
  }
}

export default App;