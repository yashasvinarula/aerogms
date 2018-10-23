import React, { Component } from 'react';

// import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, Image } from 'react-bootstrap/lib/';

import '../App.css';
import AeroLogoHeader from '../images/AeroLogoHeader.png'

class NavbarLogin extends Component {
    render(){
        return (
            <div className="top-padding">
                <Navbar row="true" fluid fixedTop>
                    <Navbar.Header className="col-md-3">
                        <Navbar.Brand>
                            <a ><Image src={AeroLogoHeader} alt="AeroGMS Logo" className="header-logo"></Image></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse className="col-md-9" pullRight>
                        <Nav row="true">
                            <NavItem className="col-md-4" eventKey={1}>Home</NavItem>
                            <NavItem className="col-md-4" eventKey={2}>About</NavItem>
                            <NavItem className="col-md-4" eventKey={3}>Contact us</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavbarLogin;