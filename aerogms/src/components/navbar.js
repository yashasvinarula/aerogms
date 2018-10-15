import React, { Component } from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, MenuItem, NavDropDown, FormGroup, FormControl, Image } from 'react-bootstrap/lib/';

// import 'materialize-css'; // It installs the JS asset only
// import 'materialize-css/dist/css/materialize.min.css';
import '../App.css';

import AeroLogoHeader from '../images/AeroLogoHeader.png'

class NavbarLogin extends Component {
    render(){
        return (
            // <div>
            //     <div>
            //         <img src={AeroLogoHeader} alt="Aero Logo" className="header-logo"></img>
            //     </div>
            //     <nav className="home-nav">
            //         <div className="">
            //           <ul className="row">
            //             <li className="col m4 center"><a href="/login">Home</a></li>
            //             <li className="col m4 center"><a href="/about">About</a></li>
            //             <li className="col m4 center"><a href="/contact">Contact us</a></li>
            //           </ul>
            //         </div>
            //     </nav>
            // </div>
            <div className="top-padding">
                <Navbar row fluid fixedTop>
                    <Navbar.Header className="col-md-3">
                        <Navbar.Brand>
                            <a ><Image src={AeroLogoHeader} alt="AeroGMS Logo" className="header-logo"></Image></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse className="col-md-9">
                        <Nav className="row">
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