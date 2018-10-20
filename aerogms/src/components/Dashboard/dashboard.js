import React, { Component } from 'react';
// import NavbarAdmin from './navbar-dashboard-admin';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, FormControl, Image, Button, ButtonGroup, Table, Pager } from 'react-bootstrap/lib/';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import '../../css/dashboard.css';
import AeroLogoHeader from '../../images/AeroLogoHeader.png';
import UserDetail from './user-details';

var arrayUser = [
    { "id" : 1, "name" : 'Parveen'},
    { "id" : 2, "name" : 'Prateek'}
]

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu : false
        }
        this.showMenu = this.showMenu.bind(this);   
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu(event) {
        event.preventDefault();
        this.setState({showMenu : true}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu(event) {
        if(!this.dropdownMenu.contains(event.target)) {
            this.setState({showMenu : false}, () => {
                document.removeEventListener('click', this.closeMenu);  
            });
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.user.id}</td>
                <td>{this.props.user.name}</td>
                <td>04-12-17</td>
                <td>Enabled</td>
                <span bsSize="small">
                        <Glyphicon id="1" className="align-vertical" onClick={this.showMenu} glyph="option-vertical" />
                        {
                            this.state.showMenu
                                ? ( <div className="menu" ref={(element) => {this.dropdownMenu = element}}>
                                        <ButtonGroup>
                                            <Button className="menuItem text-center">Edit</Button>
                                            <Button className="menuItem text-center">Remove</Button>
                                            <Button className="menuItem text-center">Toggle Status</Button>
                                            <Button className="menuItem text-center">Details</Button>
                                        </ButtonGroup>   
                                    </div>
                                )
                                : (null) 
                        }
                </span>
            </tr>
        );
    }
}

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId : '',
            username : '',
            regDate : '',
            status : '',
            // showMenu : false
        }
        this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleLogout(event) {
        event.preventDefault();
        console.log(this.props);
        this.props.doLogout();
    }

    // showMenu(event) {
    //     event.preventDefault();
    //     this.setState({showMenu : true}, () => {
    //         document.addEventListener('click', this.closeMenu);
    //     });
    // }

    // closeMenu(event) {
    //     if(!this.dropdownMenu.contains(event.target)) {
    //         this.setState({showMenu : false}, () => {
    //             document.removeEventListener('click', this.closeMenu);  
    //         });
    //     }
    // }

    render()
    {
        console.log(this.props);
        console.log('I am in dashboard: ' + this.props.userDetails.email);
        // if(!this.props.userDetails.isLoggedIn)
        // {
        //   return <Redirect to={{pathname:'/login'}}/>
        // }
        return (
            <div>
                {/* <NavbarAdmin username={this.props.userDetails.username} isLoggedIn={this.props.userDetails.isLoggedIn} doLogout={this.props.doLogout}/> */}
                <Navbar className="show-grid" fixedTop  username={this.props.userDetails.username} isLoggedIn={this.props.userDetails.isLoggedIn} doLogout={this.props.doLogout}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/home"><Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin" /></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                        <Nav pullRight>
                            <NavItem>
                                <style type="text/css">{`
                                    .form-control {
                                        border-radius : 50px;
                                `}</style>
                                <FormControl id="serach-input" type="text" placeholder="Search"></FormControl>
                            </NavItem>
                            <NavItem>
                                <span className="bell-parent">
                                    <style type="text/css">
                                        .glyphicon-bell {`
                                            width : 30px;
                                            height : 30px;
                                        `}
                                    </style>
                                    <Glyphicon glyph="bell"/>
                                    <span className="bell-child text-center">1</span>
                                </span>
                            </NavItem>
                            <NavItem>
                                <div className="circular-icon text-center">
                                    <span>{this.props.username}</span>
                                </div>
                            </NavItem>
                            <NavItem>
                                <div>
                                    <Button name="btnLogout" onClick={this.handleLogout}>Logout</Button>
                                </div>
                            </NavItem>
                        </Nav>
                </Navbar>
                <div className="top-padding container">
                    <Table striped condensed hover>
                        <thead>
                            <tr>
                                <th>User Id</th>
                                <th>User Name <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                                <th>Registration Date <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                                <th>Status <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrayUser.map((user) => {
                                 return  <TableRow user={user}/>
                                })
                            }
                        </tbody>
                    </Table>
                    <Pager>
                        <Pager.Item previous href="#">Previous</Pager.Item>{' '}
                        <Pager.Item next href="#">Next</Pager.Item>
                    </Pager>
                </div>
            </div>
        );
    }
}

export default Dashboard;