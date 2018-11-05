import React, { Component } from 'react';

import {Nav, NavItem, Image } from 'react-bootstrap/lib';
import '../../css/featureInfo.css'
import Cross from '../../images/cross.png';

class Feature extends Component {
    render() {
        return (
            <div>
                <div className="bottom-window">
                    <button className="show-window">Show Window</button>
                    <div className="hide-window">
                        <Image src={Cross}className="cross-image" />
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
                </div>
            </div>
        );
    }
}

export default Feature;
