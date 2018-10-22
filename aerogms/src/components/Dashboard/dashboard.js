import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
// import NavbarAdmin from './navbar-dashboard-admin';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, FormControl, Image, Button, ButtonGroup, Table, Pager } from 'react-bootstrap/lib/';
import {Redirect} from 'react-router-dom';
import '../../css/dashboard.css';
import AeroLogoHeader from '../../images/AeroLogoHeader.png';
import UserDetail from './user-details';

import TableRow from './user_table';

import {connect} from 'react-redux';
import {getUsers} from '../../actions';
class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId : '',
            username : '',
            regDate : '',
            status : '',
        }
        this.renderUsers = this.renderUsers.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        debugger
        if(Object.keys(this.props.users).length == 0)
        {
            this.props.getUsers();
        }
        // axios.get('/api/userlist')
        // .then(response => {
        //     debugger
        //     console.log('user response: ')
        //     console.log(response.data.message)
        //     if (response.status === 200) {
        //         // update App.js state
        //     }
        // }).catch(error => {
        //     if(error.response.status===401)
        //     {
        //         alert('user list error');
        //     }
        //     console.log(error);
        // })
    }

    handleLogout(event) {
        event.preventDefault();
        console.log(this.props);
        this.props.doLogout();
    }


    renderUsers(){
    return _.map(this.props.users, user => {
            return (
               <TableRow key={user.u_id} user={user}/>
                )
        })}

    render()
    {
        debugger;
        console.log(this.props);
        console.log('Users List:');
        console.log(this.props.users);

        console.log('I am in dashboard: ' + this.props.userDetails.email);
        if(!this.props.userDetails.isLoggedIn)
        {
          return <Redirect to={{pathname:'/login'}}/>
        }
        if(this.props.userDetails.email!=="elevenx099@gmail.com")
        {
          return <Redirect to={{pathname:'/login'}}/>
        }
        return (
            <div>
                {/* <NavbarAdmin username={this.props.userDetails.username} isLoggedIn={this.props.userDetails.isLoggedIn} doLogout={this.props.doLogout}/> */}
                <Navbar className="show-grid" fixedTop >
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
                                    <span>{this.props.userDetails.username.charAt(0)}</span>
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
                            {this.renderUsers()}
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


function mapStateToProps({users}){
    return {users}
}

export default connect(mapStateToProps, {getUsers})(Dashboard);