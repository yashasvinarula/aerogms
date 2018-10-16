import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, FormControl, Image, Button, ButtonGroup, Table, Pager } from 'react-bootstrap/lib/';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import '../../css/dashboard.css';
import AeroLogoHeader from '../../images/AeroLogoHeader.png';

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

class UserDashboard extends Component {
    constructor(props){
        super(props);  
        this.state = {
            showUserMenu : false
        } 
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu(event) {
        event.preventDefault();
        this.setState({showUserMenu : true}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu() {

    }

    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/home"><Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin" /></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem>
                            <Button className="btn-color">+ Create A New Project</Button>
                        </NavItem>
                        <NavItem>
                            <div className="circular-icon text-center">
                                <span>{this.props.username}</span>
                            </div>
                        </NavItem>
                    </Nav>
                </Navbar>
                <div>
                    <p className="text-center">No Project is created by you</p>
                </div>
            </div>
        );
    }
}

export default UserDashboard;