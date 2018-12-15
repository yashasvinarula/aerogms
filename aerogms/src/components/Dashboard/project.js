import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Image, Modal, DropdownButton, MenuItem } from 'react-bootstrap/lib/';
import mapThumbnail from '../../images/map_thumbnail.jpeg';
import axios from 'axios';
import {BASE_URL} from '../../config';

import {connect} from 'react-redux';
import {deleteProject, renameProject, resetLayerStore} from '../../actions';

const dropDownTitle = (<Glyphicon className="menu" onClick={this.showMenu} glyph="option-vertical" />);

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu : false,
            projectName:this.props.prodetails.pro_name,
            showmodal: false,
            rediectTo:false
        }
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.renameProject = this.renameProject.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    showMenu(event) {
        event.preventDefault();
        this.setState({showMenu : true}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeModal() {
        this.setState({ showmodal: false });
    }

    closeMenu(event) {
        if(this.dropdownMenu){
        if(!this.dropdownMenu.contains(event.target)) {
            this.setState({showMenu : false}, () => {
                document.removeEventListener('click', this.closeMenu);  
            });
        }
    }
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({projectName : value});
    }

    deleteProject(){
        if(window.confirm(`Do you really want to delete ${this.state.projectName} project!`))
        {
            this.props.deleteProject(this.props.prodetails.pro_id);
        }
    }
    renameProject(){
        //this.props.renameProject(this.props.prodetails.pro_id, this.state.projectName);
        let pro_name = this.state.projectName;
        let email = this.props.email;
        axios.post(`${BASE_URL}/pro_name_exists`, {pro_name:pro_name, owner_email:email})
        .then(response => {
            if(response.data.pro_id == null ){
                this.props.renameProject(this.props.prodetails.pro_id, pro_name);
                this.setState({projectName:'', showmodal:false})
            }
            else{
                alert('Project name is already exists!');
            }
        })
        .catch(err=>{
            if(err.response.data.status === 'unauthorised')
            {
                err.response.data.message ? alert(err.response.data.message):'';
                this.props.doLogout();
            }
            else{
                err.response.data.message ? alert(err.response.data.message):'';
            }
        })
    }

    render() {
        if(this.state.rediectTo){
            this.props.resetLayerStore();
        return <Redirect to={`/projectView?pro_id=${this.props.prodetails.pro_id}`} />
        }
        return (
            <div className="col-md-2 col-xs-6 col-sm-4 project-Item">
            <div className="project">
                <div className="" onClick={()=>{this.setState({rediectTo:true})}}>
                    <Image src={mapThumbnail} className="map-thumbnail" />
                </div>
                <div className="drawing-bottom">
                    <span className="pos-drawing">{this.props.prodetails.pro_name}</span>
                    <span className="pos-drawing drawing-right">
                    <DropdownButton id="ddlMenu" className="menu" noCaret title={dropDownTitle} pullRight >
                      <MenuItem className="" onClick={this.deleteProject}>Delete</MenuItem>
                      <MenuItem className="modal-container"
                        onClick={() => {
                          this.setState({ showmodal: true });
                        }}
                      >Rename</MenuItem>
                      <Modal
                        show={this.state.showmodal}
                        onHide={this.closeModal}
                        container={this}
                      >
                        <Modal.Header closeButton />
                        <Modal.Body>
                          <label htmlFor="project-name">Rename Project Title</label>
                          <input
                            type="text"
                            name="projectName"
                            value={this.state.projectName}
                            onChange={this.handleChange}
                          />
                          <button type="submit" onClick={this.renameProject}>Save</button>
                        </Modal.Body>
                      </Modal>
                      {/* <MenuItem>Details</MenuItem> */}
                    </DropdownButton>
                    </span>
                    <span className="pos-drawing">{this.props.prodetails.date_time}</span>
                </div>
            </div>
            </div>
        );
    }
  }

export default connect(null, {deleteProject, renameProject, resetLayerStore})(Project);
