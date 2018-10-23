import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, Image, Button, ButtonGroup, Modal } from 'react-bootstrap/lib/';
// import {Redirect} from 'react-router-dom';
// import axios from 'axios';
import '../../css/dashboard.css';
import AeroLogoHeader from '../../images/AeroLogoHeader.png';
import mapThumbnail from '../../images/map_thumbnail.jpeg';

class UserNavs extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div>
                <Nav bsStyle="tabs" className="nav-user">
                    <NavItem className="navItem-user">My Projects</NavItem>
                    <NavItem className="text-center navItem-user">All</NavItem>
                    <NavItem className="navItem-user">Recent</NavItem>
                    <NavItem className="navItem-user">Shared</NavItem>
                    <NavItem className="pull-right">
                        <span>
                            <Glyphicon glyph="sort-by-attributes-alt"></Glyphicon>
                        </span>
                    </NavItem>
                </Nav>
            </div>
        );
    }
}

class ProjectThumbnail extends Component {
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
            <div className="project">
                <div className="md">
                    <Image src={mapThumbnail} className="map-thumbnail"/>
                </div>
                <div className="drawing-bottom">
                    <span className="pos-drawing drawing-left">Drawing 1</span>
                    <span className="pos-drawing drawing-right">
                        <Glyphicon onClick={this.showMenu} glyph="option-vertical"></Glyphicon>
                        {
                            this.state.showMenu
                                ? ( <div className="menu" ref={(element) => {this.dropdownMenu = element}}>
                                        <ButtonGroup>
                                            <Button className="menuItem text-center">Delete</Button>
                                            <Button className="menuItem text-center">Share</Button>
                                            <Button className="menuItem text-center">Details</Button>
                                        </ButtonGroup>   
                                    </div>
                                )
                                : (null) 
                        }
                    </span>
                </div>
            </div>
        );
    }
}

class UserDashboard extends Component {
    constructor(props){
        super(props);  
        this.state = {
            showUserMenu : false,
            showmodal : false,
            projectName : '',
        } 

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    showModal() {
        this.setState({ showmodal : true });
    }

    closeModal() {
        this.setState({ showmodal : false });
    } 

    handleChange(event) {
        const value = event.target.value;
        this.setState({projectName : value});
    }

    showMenu(event) {
        event.preventDefault();
        this.setState({showUserMenu : true});
        //     , () => {
        //     document.addEventListener('click', this.closeMenu);
        // });
    }

    closeMenu(event) {
        if(!this.dropdownMenu.contains(event.target)) {
            this.setState({showUserMenu : false}, () => {
                document.removeEventListener('click', this.closeMenu);  
            });
        }
    }

    logOut(){
        this.setState({showUserMenu : false});
        this.props.doLogout();
    }

    render() {
        // if(!this.props.userDetails.isLoggedIn)
        // {
        //   return <Redirect to={{pathname:'/login'}}/>
        // }
        return (
            <div>
                <Navbar className="navbar-css">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/home"><Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin" /></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem className="modal-container">
                            <Button className="btn-color" id="create-project" 
                                onClick={() => {this.setState({showmodal : true})}}
                            >
                                + Create A New Project
                            </Button>
                            <Modal show={this.state.showmodal} onHide={this.closeModal} container={this}>
                                <Modal.Header closeButton></Modal.Header>
                                <Modal.Body> 
                                    <label htmlFor="project-name">Enter Project Title</label>
                                    <input type="text" name="projectName" value={this.state.projectName} onChange={this.handleChange}></input>
                                    <button type="submit">Save</button>
                                </Modal.Body>
                            </Modal>
                        </NavItem>
                        <NavItem>
                            <div className="circular-icon text-center" onClick={this.showMenu}>
                                <span>{this.props.userDetails.username.charAt(0)}</span>
                            </div>
                            {
                                this.state.showUserMenu
                                    ? ( <div className="user-icon-menu row" ref={(element) => {this.dropdownMenu = element}}>
                                            <div className="circular-icon-menu text-center col-md-3">
                                                <span>{this.props.username}</span>
                                            </div>
                                            <div className="col-md-9">
                                                <p>{this.props.userDetails.username}</p>
                                                <p>{this.props.userDetails.email}</p>
                                                <ButtonGroup>
                                                    <style type="text/css">{`
                                                        .btn {
                                                            padding : 3px 6px;
                                                        }
                                                    `}
                                                    </style>
                                                    <Button className="">Profile</Button>
                                                    <Button className="" pullRight onClick={this.logOut}>Logout</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    )
                                    : (null) 
                            }
                        </NavItem>
                    </Nav>
                </Navbar>
                <div className="container">
                    <UserNavs />
                    <ProjectThumbnail />
                </div>
            </div>
        );
    }
}

export default UserDashboard;