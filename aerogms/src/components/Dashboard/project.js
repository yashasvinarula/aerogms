import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Button, ButtonGroup, Image, Modal } from 'react-bootstrap/lib/';
import mapThumbnail from '../../images/map_thumbnail.jpeg';
import axios from 'axios';

import {connect} from 'react-redux';
import {deleteProject, renameProject} from '../../actions';

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu : false,
            projectName:this.props.prodetails.pro_name,
            showmodal: false
        }
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.openProject = this.openProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.renameProject = this.renameProject.bind(this);
    }

    showMenu(event) {
        event.preventDefault();
        this.setState({showMenu : true}, () => {
            document.addEventListener('click', this.closeMenu);
        });
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

    openProject(event){
        console.log(this.props.prodetails);
    }

    deleteProject(){
        this.props.deleteProject(this.props.prodetails.pro_id);
    }
    renameProject(){
        //this.props.renameProject(this.props.prodetails.pro_id, this.state.projectName);
        debugger
        let pro_name = this.state.projectName;
        let email = this.props.email;
        axios.post('/api/pro_name_exists', {pro_name:pro_name, owner_email:email}).
        then(response => {
            if(response.data.pro_id == null ){
                this.props.renameProject(this.props.prodetails.pro_id, pro_name);
                this.setState({projectName:'', showmodal:false})
            }
            else{
                alert('Project name is already exists!');
            }
        }).
        catch(err=>{
            console.log(err);
        })
    }

    render() {
        debugger
        return (
            <div className="col-md-2 project-Item">
            <div className="project">
                <div className="md" onClick={this.openProject}>
                    <Image src={mapThumbnail} className="map-thumbnail"/>
                </div>
                <div className="drawing-bottom">
                    <span className="pos-drawing">{this.props.prodetails.pro_name}</span>
                    <span className="pos-drawing drawing-right">
                        <Glyphicon onClick={this.showMenu} glyph="option-vertical"></Glyphicon>
                        {
                            this.state.showMenu
                                ? ( <div className="menu" ref={(element) => {this.dropdownMenu = element}}>
                                        <ButtonGroup>
                                            <Button className="menuItem text-center" onClick={this.deleteProject}>Delete</Button>
                                            <div>
                                            <Button className="menuItem text-center" onClick={() => {this.setState({showmodal : true})}}>Rename</Button>
                                            <Modal show={this.state.showmodal} onHide={this.closeModal} container={this}>
                                            <Modal.Header closeButton></Modal.Header>
                                            <Modal.Body> 
                                                <label htmlFor="project-name">Rename Project Title</label>
                                                <input type="text" name="projectName" value={this.state.projectName} onChange={this.handleChange}></input>
                                                <button type="submit" onClick={this.renameProject}>Save</button>
                                            </Modal.Body>
                                            </Modal>
                                            </div>
                                            {/* <Button className="menuItem text-center">Details</Button> */}
                                        </ButtonGroup>   
                                    </div>
                                )
                                : (null) 
                        }
                    </span>
                    <span className="pos-drawing">{this.props.prodetails.date_time}</span>
                </div>
            </div>
            </div>
        );
    }
}

export default connect(null, {deleteProject, renameProject})(Project);