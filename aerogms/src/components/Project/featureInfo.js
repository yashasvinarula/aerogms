import React, { Component } from 'react';

import {Nav, NavItem } from 'react-bootstrap/lib';
import '../../css/featureInfo.css'

class Feature extends Component {
    render() {
        return (
            <div>
                <div className="feature">
                    <small><label>Id</label></small>
                    <p>This</p>
                    <hr />
                </div>
                <div className="query-list-container">
                    <Nav className="query-list">
                        <NavItem className="">Complaint</NavItem>
                        <NavItem className="">Suggestion</NavItem>
                        <NavItem className="">Question</NavItem>
                        <NavItem className="">Remarks</NavItem>
                        <NavItem className="">Edit Request</NavItem>
                    </Nav>
                </div>
            </div>
        );
    }
}

export default Feature;
