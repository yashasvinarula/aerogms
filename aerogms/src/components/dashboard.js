import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, MenuItem, NavDropDown, FormGroup, FormControl, Table, Pager } from 'react-bootstrap/lib';

import AeroLogoHeader from '../images/AeroLogoHeader.png'
import '../css/dashboard.css';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/home"><img src={AeroLogoHeader} alt="Aero Logo" className="header-logo"></img></a>
                        </Navbar.Brand>
                        <Nav>
                            <NavItem>
                                <Navbar.Form>
                                    <FormGroup>
                                        <FormControl type="text" placeholder="Search"></FormControl>
                                    </FormGroup>
                                </Navbar.Form>
                            </NavItem>
                            <NavItem>
                                <span className="bell-parent" >
                                    <Glyphicon glyph="bell"/>
                                    <span className="bell-child text-center">1</span>
                                </span>
                            </NavItem>
                            <NavItem>
                                <div className="circular-icon text-center">
                                    <span>S</span>
                                </div>
                            </NavItem>
                        </Nav>
                    </Navbar.Header>    
                </Navbar> 
                <Table>
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>User Name <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                            <th>Registraion Date <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                            <th>Status <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1234AB</td>
                            <td>Parveen Sahrawat</td>
                            <td>04-12-17</td>
                            <td>Enabled</td>
                            <span bsSize="small">
                                <Glyphicon glyph="option-vertical" />
                            </span>
                        </tr>
                    </tbody>
                </Table>
                <Pager>
                    <Pager.Item previous href="#">Previous</Pager.Item>{' '}
                    <Pager.Item next href="#">Next</Pager.Item>
                </Pager>
            </div>
        );
    }
}
export default Dashboard