import React, { Component } from 'react';
import{ NavItem, Navbar, Nav, Image } from 'react-bootstrap/lib';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
import AeroLogo from '../../images/AeroLogoHeader.png'
import '../../css/property-tax.css';

class PropertyTax extends Component {
    constructor(props) {
        super(props);
        this.state ={
            from: undefined,
            to: undefined,
            selFYear:'2018-2019',
            // showMapBtn : true,
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
        // if(this.state.to !== "undefined" && this.state.from !== "undefined")
        //     this.setState({ showMapBtn : true });
        // else {
            this.setState({ from })
        // }
        console.log(from);
        console.log((moment(from).format("X") - 43200)*1000);
    }
    handleToChange(to){
        // if(this.state.from !== "undefined" && this.state.to !== "undefined")
        //     this.setState({ showMapBtn : true });
        // else {
            this.setState({ to }, this.showFromMonth);
        // }
        console.log(to);
        console.log((moment(to).format("X") - 43200)*1000);
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Image src={AeroLogo} className="aero-img" />
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem>
                            <select id='ddlPropertyCat'>
                                <option value="0">-Type-</option>
                                <option value="pro_tax" selected>Tax</option>
                            </select>
                        </NavItem>
                        <NavItem>
                            <select id='ddlSelFY'>
                                <option value="0">-Year-</option>
                                <option value="2018-2019" selected>2018-19</option>
                            </select>
                        </NavItem>
                        <NavItem>
                            <DayPickerInput value={from}  placeholder="From" format="LL"
                                formatDate={formatDate} parseDate={parseDate} dayPickerProps={{
                                selectedDays: [from, { from, to }],
                                fromMonth:new Date(this.state.selFYear.split('-')[0], 3),
                                toMonth: new Date(this.state.selFYear.split('-')[1], 2), modifiers, numberOfMonths: 1,
                                onDayClick: () => this.to.getInput().focus(),}}
                                onDayChange={this.handleFromChange}
                            />
                        </NavItem>
                        <NavItem>
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
                        </NavItem>
                        {
                            this.state.from && this.state.to ? 
                                (
                                    <NavItem className="nav-items"><input 
                                        className={this.state.from !== "undefined" && this.state.to !== "undefined" ? "show-map-btn" : "hide-show-map-btn"} 
                                        type="button" value="Show Map" onClick={()=>{window.addSnagatMandiLayer()}}/>
                                    </NavItem>
                                )
                            :   ''
                        }
                        <NavItem>Logout</NavItem>
                    </Nav>
                </Navbar>
                {/* <div  id="taxqueryBox" className="sangatmandi-infobox"> 
                <div className="InputFromTo">
                    <span className="InputFromTo-to">
                    </span>
                </div>
            </div> */}
            </div>
        );
    }

}

export default PropertyTax;