import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, MenuItem, NavDropDown, FormGroup, FormControl, Image, Button } from 'react-bootstrap/lib/';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';



class NavbarAdmin extends Component {
    constructor(props){
        super(props);
        this.state = { redirectTo: null}
        this.handleLogout = this.handleLogout.bind(this);
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
                                        <span><b>{this.props.username.charAt(0)}</b></span>
                                    </div>
                                </NavItem>
                                <NavItem>
                                    <div>
                                        <Button name="btnLogout" onClick={this.handleLogout}>Logout</Button>
                                    </div>
                                </NavItem>
                            </Nav>
                    </Navbar> 
                </div>
            );
    }
}

export default NavbarAdmin;