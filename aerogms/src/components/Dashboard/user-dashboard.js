import React, { Component } from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { Navbar, Nav,NavItem, Image, Button, Modal, DropdownButton, MenuItem } from "react-bootstrap/lib/";
import {Redirect} from 'react-router-dom';
// import axios from 'axios';
import "../../css/dashboard.css";
import AeroLogoHeader from "../../images/AeroLogoHeader.png";
import ProjectItem from './project';

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
              <Glyphicon glyph="sort-by-attributes-alt" />
            </span>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserMenu: false,
      showmodal: false,
      projectName: ""
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showModal() {
    this.setState({ showmodal: true });
  }

  closeModal() {
    this.setState({ showmodal: false });
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ projectName: value });
  }

  showMenu(event) {
    event.preventDefault();
    this.setState({ showUserMenu: true });
    //     () => {
    //     document.addEventListener('click', this.closeMenu);
    // });
  }

  closeMenu(event) {
    // if(!this.dropdownMenu.contains(event.target)) {
    this.setState({ showUserMenu: false });
    //         , () => {
    //         document.removeEventListener('click', this.closeMenu);
    //     });
    // }
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
              <a href="/home">
                <Image src={AeroLogoHeader} alt="Aero Logo" responsive className="header-logo-admin"
                />
              </a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem className="modal-container">
              <Button
                className="btn-color"
                id="create-project"
                onClick={() => {
                  this.setState({ showmodal: true });
                }}
              >
                + Create A New Project
              </Button>
              <Modal
                show={this.state.showmodal}
                onHide={this.closeModal}
                container={this}
              >
                <Modal.Header closeButton />
                <Modal.Body>
                  <label htmlFor="project-name">Enter Project Title</label>
                  <input
                    type="text"
                    name="projectName"
                    value={this.state.projectName}
                    onChange={this.handleChange}
                  />
                  <button type="submit">Save</button>
                </Modal.Body>
              </Modal>
            </NavItem>
            <NavItem pullRight className="">
              <DropdownButton
                title={this.props.userDetails.username.charAt(0)}
                noCaret
                className="circular-icon text-center row"
              >
                <MenuItem className="circular-icon-menu text-center col-md-2">
                  <span>{this.props.userDetails.username.charAt(0)}P</span>
                </MenuItem>
                <div className="row col-md-10">
                  <MenuItem className="col-md-12">
                    <p>
                      {this.props.userDetails.username}
                      Parveen Sahrawat
                    </p>
                  </MenuItem>
                  <MenuItem className="col-md-12">
                    <p>
                      {this.props.userDetails.email}
                      parveen.sahrawat1209@gmail.com
                    </p>
                  </MenuItem>
                  <MenuItem>
                    <Button className="col-md-6">Profile</Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      className="col-md-6"
                      pullRight
                      onClick={this.props.doLogout}
                    >
                      Logout
                    </Button>
                  </MenuItem>
                </div>
              </DropdownButton>
            </NavItem>
          </Nav>
        </Navbar>
        <div className="container">
          <UserNavs />
          <div className="row">
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
            <ProjectItem />
          </div>
        </div>
      </div>
    );
  }
}

export default UserDashboard;
