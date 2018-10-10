import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, MenuItem, NavDropDown, FormGroup, FormControl, Image } from 'react-bootstrap/lib/';


import AeroLogoHeader from '../../images/AeroLogoHeader.png';

class NavbarAdmin extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return (
            <div>
                <Navbar default className="show-grid" fluid fixedTop>
                    <Navbar.Header xs={4}>
                        <Navbar.Brand>
                            <a href="/home"><Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin" /></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem>
                                <FormControl type="text" placeholder="Search"></FormControl>
                            </NavItem>
                            <NavItem>
                                <span className="bell-parent">
                                    <Glyphicon className="bell-size" glyph="bell"/>
                                    <span className="bell-child text-center center-align">1</span>
                                </span>
                            </NavItem>
                            <NavItem>
                                <div className="circular-icon text-center">
                                    <span className="center-align">S</span>
                                </div>
                            </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                </Navbar> 
            </div>
        );
    }
}

export default NavbarAdmin;