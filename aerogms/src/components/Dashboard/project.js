import React, { Component } from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { Image, Button, ButtonGroup, Modal, DropdownButton, MenuItem } from "react-bootstrap/lib/";
import mapThumbnail from "../../images/map_thumbnail.jpeg";
import "../../css/dashboard.css";

const dropDownTitle = (<Glyphicon className="menu" onClick={this.showMenu} glyph="option-vertical" />);

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      projectName: "",
      showmodal: false,
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  }

  closeMenu(event) {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener("click", this.closeMenu);
      });
    }
  }

  render() {
    return (
      <div className="project-Item col-md-2 col-xs-6 col-sm-4">
        <div className="project">
          <div className="">
            <Image src={mapThumbnail} className="map-thumbnail" />
            <div className="drawing-bottom">
            <span className="pos-drawing">Drawing 1</span>
            <span className="pos-drawing drawing-right">
            
            <DropdownButton className="menu" noCaret title={dropDownTitle} >
              <MenuItem>Delete</MenuItem>
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
              <MenuItem>Details</MenuItem>
            </DropdownButton>
            </span>
          </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Project;
