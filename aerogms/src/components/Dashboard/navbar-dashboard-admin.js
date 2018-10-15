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
                     
                </div>
            );
    }
}

export default NavbarAdmin;