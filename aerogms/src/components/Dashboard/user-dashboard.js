import React, { Component } from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { Navbar, Nav,NavItem, Image, Button, Modal, DropdownButton, MenuItem } from "react-bootstrap/lib/";
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {createProject, getProjects} from '../../actions';
import _ from 'lodash';
import axios from 'axios';
import '../../css/dashboard.css';
import AeroLogoHeader from '../../images/AeroLogoHeader.png';
import ProjectItem from './project';

class UserNavs extends Component {
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

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserMenu: false,
      showmodal: false,
      projectName: "",
    };

        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logOut = this.logOut.bind(this);
        this.renderProjects = this.renderProjects.bind(this);
        this.createProject = this.createProject.bind(this);
    }

    componentDidMount(){
        if(Object.keys(this.props.projects).length === 0)
        {
            this.props.getProjects(this.props.userDetails.email);
        }
    }

    closeModal() {
        this.setState({ showmodal : false });
    }

    handleChange(event) {
      const value = event.target.value;
      this.setState({ projectName: value });
    }

    logOut(){
        debugger
        this.setState({showUserMenu : false});
        this.props.doLogout();
    }

    createProject(){
        debugger
        let pro_name = this.state.projectName;
        if(pro_name === null || pro_name ===''){
            return alert('Please enter name for project!');
        }
        let email = this.props.userDetails.email;
        axios.post('/api/pro_name_exists', {pro_name:pro_name, owner_email:email})
        .then(response => {
            if(response.data.pro_id == null ){
                this.props.createProject(pro_name, email);
                this.setState({projectName:''})
                this.closeModal();
            }
            else{
                alert('Project name is already exists!');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    renderProjects(){
        debugger
        if(Object.keys(this.props.projects).length>0){
            return _.map(this.props.projects, project=>{
                return (<ProjectItem key={project.pro_id}  prodetails={project} email={this.props.userDetails.email} />)
            })
        }
    }


    render() {
        debugger
        if(!this.props.userDetails.isLoggedIn)
        {
          return <Redirect to={{pathname:'/login'}}/>
        }
        
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
                                    <button type="submit" onClick={this.createProject}>Save</button>
                                </Modal.Body>
                            </Modal>
                        </NavItem>
                        <NavItem>
                            <DropdownButton id="ddb"
                                title={this.props.userDetails.username.charAt(0)}
                                noCaret
                                className="circular-icon text-center row"
                              >
                                <MenuItem className="circular-icon-menu text-center col-md-2">
                                  <span>{this.props.userDetails.username.charAt(0)}</span>
                                </MenuItem>
                                <div className="row col-md-10">
                                  <MenuItem className="col-md-12">
                                    <p>
                                      {this.props.userDetails.username}
                                    </p>
                                  </MenuItem>
                                  <MenuItem className="col-md-12">
                                    <p>
                                      {this.props.userDetails.email}
                                    </p>
                                  </MenuItem>
                                  <MenuItem>
                                    <Button className="col-md-6">Profile</Button>
                                  </MenuItem>
                                  <MenuItem>
                                    <Button className="col-md-6" pullRight
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
                        {this.renderProjects()}
                    </div>
                </div>
        </div>
    );
  }
}

function mapStateToProps({projects})
{
    return {projects}
}

export default connect(mapStateToProps, {createProject, getProjects})(UserDashboard);
