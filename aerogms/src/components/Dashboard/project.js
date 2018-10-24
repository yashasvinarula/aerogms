import React, { Component } from 'react';
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { Image, Button, ButtonGroup } from "react-bootstrap/lib/";
import mapThumbnail from "../../images/map_thumbnail.jpeg";

class Project extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showMenu: false
      };
      this.showMenu = this.showMenu.bind(this);
      this.closeMenu = this.closeMenu.bind(this);
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
        <div className="project-Item col-md-2 col-sm-6">
        <div className="project">
          <div className="">
            <Image src={mapThumbnail} className="map-thumbnail" />
          </div>
          <div className="drawing-bottom">
            <span className="pos-drawing">Drawing 1</span>
            <span className="pos-drawing drawing-right">
              <Glyphicon onClick={this.showMenu} glyph="option-vertical" />
              {this.state.showMenu ? (
                <div
                  className="menu"
                  ref={element => {
                    this.dropdownMenu = element;
                  }}
                >
                  <ButtonGroup>
                    <Button className="menuItem text-center">Delete</Button>
                    <Button className="menuItem text-center">Share</Button>
                    <Button className="menuItem text-center">Details</Button>
                  </ButtonGroup>
                </div>
              ) : null}
            </span>
          </div>
        </div>
        </div>
      );
    }
  }

export default Project;