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
                <Navbar className="show-grid">
                    <Navbar.Header xs={4}>
                        <Navbar.Brand>
                            <a href="/home"><Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin" /></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                        <Nav >
                            <NavItem>
                                <FormControl type="text" placeholder="Search"></FormControl>
                            </NavItem>
                            <NavItem>
                                <span className="bell-parent" bssize="large">
                                    <Glyphicon className="bell-size" glyph="bell"/>
                                    <span className="bell-child text-center">1</span>
                                </span>
                            </NavItem>
                            <NavItem>
                                <div className="circular-icon text-center">
                                    <span>S</span>
                                </div>
                            </NavItem>
                        </Nav>
                </Navbar> 
            </div>
        );
    }
}

export default NavbarAdmin;