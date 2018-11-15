import React, { Component } from 'react';
import _ from 'lodash';
// import axios from 'axios';
// import NavbarAdmin from './navbar-dashboard-admin';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, FormControl, Image, Button, Table, MenuItem, NavDropdown, DropdownButton } from 'react-bootstrap/lib/';
import MediaQuery from 'react-responsive';
import {Redirect} from 'react-router-dom';
import '../../css/dashboard.css';
import AeroLogoHeader from '../../images/AeroLogoHeader.png';
import AeroLogo from '../../images/AeroLOGO.png';
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
        if(Object.keys(this.props.users).length === 0)
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

    gotomap() {
        return <Redirect to={{pathname : '/Projectview'}} />
    }

    render()
    {
        //debugger;
        // if(!this.props.userDetails.isLoggedIn)
        // {
        //   return <Redirect to={{pathname:'/login'}}/>
        // }
        // if(this.props.userDetails.isadmin === "false")
        // {
        //     return <Redirect to={{pathname:'/userDashboard'}}/>
        // }
        // if(this.props.users['error']){
        //     debugger
        //     alert('Your session is expired. Please login!')
        //     console.log('error session out!');
        //     this.props.doLogout();
        //     return <Redirect to='/login' />
        // }
       
        return (
            <MediaQuery maxWidth={768}>
                {(matches) => {
                    if(matches) {
                        return (
                        <div className="">
                        <Navbar className=""  >
                            <Navbar.Header className="navbar-admin">
                                <Navbar.Brand>
                                    <a href=""><Image src={AeroLogo} alt="Aero Logo" responsive className="header-logo-admin-mobile" /></a>
                                </Navbar.Brand>
                            </Navbar.Header>
                            <Nav pullRight className="nav-admin">
                                <NavItem className="">
                                    <style type="text/css">{`
                                        .form-control {
                                            border-radius : 50px;
                                            width : 120px;
                                            height: 28px;
                                    `}</style>
                                    <FormControl id="serach-input" type="text" placeholder="Search"></FormControl>
                                </NavItem>
                                <NavDropdown noCaret title="More" id="basic-nav-dropdown" className="dropdown-custom">
                                  <MenuItem href="/Projectview" >Map</MenuItem>
                                  {/* <MenuItem href="/analytics" >Analytics</MenuItem>
                                  <MenuItem href="/validation" >Validation</MenuItem> */}
                                </NavDropdown>
                                {/* <NavItem>
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
                                </NavItem> */}
                                <NavItem className="">
                                    {/* <div className="circular-icon-mobile text-center">
                                        <span>{this.props.userDetails.username.charAt(0)}</span>
                                    </div> */}
                                <DropdownButton id="ddb"
                                    title={this.props.userDetails.username.charAt(0)}
                                    noCaret
                                    className="circular-icon text-center"
                                  >
                                    <div className="">
                                      <MenuItem className="">
                                        <p className="menu-text">
                                          {this.props.userDetails.username}
                                        </p>
                                      </MenuItem>
                                      <MenuItem className="">
                                        <p className="menu-text">
                                          {this.props.userDetails.email}
                                        </p>
                                      </MenuItem>
                                      <MenuItem>
                                        <Button className="">Profile</Button>
                                      </MenuItem>
                                      <MenuItem>
                                        <Button name="btnLogout" className="" pullRight
                                          onClick={this.handleLogout}
                                        >
                                          Logout
                                        </Button>
                                      </MenuItem>
                                      </div>
                                  </DropdownButton>
                                </NavItem>
                            </Nav>
                        </Navbar>
                        <div className="">
                            <Table striped condensed hover>
                                <thead className="container">
                                    <tr className="row">
                                        <th className="th-admin text-center col-sm-3">User Id</th>
                                        <th className="th-admin text-center col-sm-3">User Name</th>
                                        <th className="th-admin text-center col-sm-3">Regn. Date</th>
                                        <th className="th-admin text-center col-sm-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="container">
                                    {this.renderUsers()}
                                </tbody>    
                            </Table>
                            {/* <Pager>
                                <Pager.Item previous href="#">Previous</Pager.Item>{' '}
                                <Pager.Item next href="#">Next</Pager.Item>
                            </Pager> */}
                        </div>
                    </div>);
                    } else {
                        return (
                        <div>
                        <Navbar className="" fixedTop >
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <a href=""><Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin" /></a>
                                </Navbar.Brand>
                            </Navbar.Header>
                                <Nav pullRight>
                                    <NavItem>
                                        <style type="text/css">{`
                                            .form-control {
                                                border-radius : 50px;
                                                width : 250px;
                                        `}</style>
                                        <FormControl id="serach-input" type="text" placeholder="Search"></FormControl>
                                    </NavItem>
                                    <NavDropdown noCaret title="More" id="basic-nav-dropdown">
                                      <MenuItem href="/Projectview" >Map</MenuItem>
                                      {/* <MenuItem href="/analytics" >Analytics</MenuItem>
                                      <MenuItem href="/validation" >Validation</MenuItem> */}
                                    </NavDropdown>
                                    {/* <NavItem>
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
                                    </NavItem> */}
                                    <NavItem>
                                        <DropdownButton id="ddb"
                                       title={this.props.userDetails.username.charAt(0)}
                                       noCaret
                                       className="circular-icon text-center"
                                     >
                                        <MenuItem className="circular-icon-menu text-center">
                                          <span>{this.props.userDetails.username.charAt(0)}</span>
                                        </MenuItem>
                                        <div className="info">
                                            <MenuItem className="">
                                              <p className="menu-text">
                                                {this.props.userDetails.username}
                                              </p>
                                            </MenuItem>
                                            <MenuItem className="">
                                              <p className="menu-text">
                                                {this.props.userDetails.email}
                                              </p>
                                            </MenuItem>
                                        </div>
                                        <MenuItem>
                                          <Button className="">Profile</Button>
                                        </MenuItem>
                                        <MenuItem>
                                          <Button name="btnLogout" className="" pullRight
                                            onClick={this.handleLogout}
                                          >
                                            Logout
                                          </Button>
                                        </MenuItem>
                                     </DropdownButton>
                                    </NavItem>
                                </Nav>
                        </Navbar>
                        <div className="top-padding">
                            <Table striped condensed hover>
                                <thead className="container">
                                    <tr>
                                        <th>User Id</th>
                                        <th>User Name <span><Glyphicon glyph="sort" /></span></th>
                                        <th>Regn. Date <span><Glyphicon glyph="sort" /></span></th>
                                        <th>Status <span><Glyphicon glyph="sort" /></span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderUsers()}
                                </tbody>
                            </Table>
                            {/* <Pager>
                                <Pager.Item previous href="#">Previous</Pager.Item>{' '}
                                <Pager.Item next href="#">Next</Pager.Item>
                            </Pager> */}
                        </div>
                    </div>
                        );
                    }
                }}
            </MediaQuery>            
        );
    }
}


function mapStateToProps({users}){
    return {users}
}

export default connect(mapStateToProps, {getUsers})(Dashboard);