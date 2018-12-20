import React, { Component } from 'react';
import{ NavItem } from 'react-bootstrap/lib';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';

class PropertyTax extends Component {
    constructor(props) {
        super(props);
        this.state ={
            from: undefined,
            to: undefined,
            selFYear:'2018-2019',
        }
        this.showFromMonth = this.showFromMonth.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }
    showFromMonth() {
        const { from, to } = this.state;
        if (!from) {
          return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
          this.to.getDayPicker().showMonth(from);
        }
    }
    handleFromChange(from) {
        this.setState({ from });
        console.log(from);
        console.log((moment(from).format("X") - 43200)*1000);
    }
    handleToChange(to){
        this.setState({ to }, this.showFromMonth);
        console.log(to);
        console.log((moment(to).format("X") - 43200)*1000);
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <div  id="taxqueryBox" className="sangatmandi-infobox"> 
                <select id='ddlPropertyCat'>
                    <option value="0">-Type-</option>
                    <option value="pro_tax">Tax</option>
                </select>
                <select id='ddlSelFY'>
                    <option value="0">-Year-</option>
                    <option value="2017-2018">2017-18</option>
                    <option value="2018-2019">2018-19</option>
                </select>
                            
                <div className="InputFromTo">
                    <DayPickerInput value={from}  placeholder="From" format="LL"
                        formatDate={formatDate} parseDate={parseDate} dayPickerProps={{
                        selectedDays: [from, { from, to }],
                        fromMonth:new Date(this.state.selFYear.split('-')[0], 3),
                        toMonth: new Date(this.state.selFYear.split('-')[1], 2), modifiers, numberOfMonths: 1,
                        onDayClick: () => this.to.getInput().focus(),}}
                        onDayChange={this.handleFromChange}
                    />
                    <br/>
                    <span className="InputFromTo-to">
                        <DayPickerInput
                          ref={el => (this.to = el)}
                          value={to}
                          placeholder="To"
                          format="LL"
                          formatDate={formatDate}
                          parseDate={parseDate}
                          dayPickerProps={{
                            selectedDays: [from, { from, to }],
                            disabledDays: { before:from, after: new Date(2019, 3) },
                            modifiers,
                            month: from,
                            fromMonth: from,
                            toMonth:new Date(this.state.selFYear.split('-')[1], 3),
                            numberOfMonths: 1,
                          }}
                          onDayChange={this.handleToChange}
                        />
                    </span>
                    <style>{`
                      .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                        background-color: #f0f8ff !important;
                        color: #4a90e2;
                      }
                      .InputFromTo .DayPicker-Day {
                        border-radius: 0 !important;
                      }
                      .InputFromTo .DayPicker-Day--start {
                        border-top-left-radius: 50% !important;
                        border-bottom-left-radius: 50% !important;
                      }
                      .InputFromTo .DayPicker-Day--end {
                        border-top-right-radius: 50% !important;
                        border-bottom-right-radius: 50% !important;
                      }
                      .InputFromTo .DayPickerInput-Overlay {
                        width: 170px;
                      }
                      .InputFromTo-to .DayPickerInput-Overlay {
                        // margin-left: -198px;
                      }
                    `}
                    </style>
                </div>
                <NavItem className="nav-items"><input className="btnLogout" type="button" value="Show Map" onClick={()=>{window.addSnagatMandiLayer()}}/></NavItem>
            </div>
        );
    }

}

export default PropertyTax;