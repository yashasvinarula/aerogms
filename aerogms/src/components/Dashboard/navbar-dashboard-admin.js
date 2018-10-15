import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, MenuItem, NavDropDown, FormGroup, FormControl, Image, Button } from 'react-bootstrap/lib/';


import AeroLogoHeader from '../../images/AeroLogoHeader.png';

class NavbarAdmin extends Component {
    constructor(props){
        super(props);
        this.state = { redirectTo: null}
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(event) {
        event.preventDefault();
        console.log(` handlesubmit ${event} is`);

        axios
            .get('/logout')
            .then(response => {
                debugger
                console.log('logout response: ')
                console.log(response)
                if (response.status === 200) {
                    // update App.js state
                    console.log('logout successfully');
                    this.setState({redirectTo:'/login'});
                }
            }).catch(error => {
                //this.setState({redirectTo:null});
                console.log(error);  
            })
    }

    render(){
        if(this.state.redirectTo)
        {
            return <Redirect to={{pathname:this.state.redirectTo}}/>
        }
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