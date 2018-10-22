import React, { Component } from 'react';
import {connect} from 'react-redux';
import {removeUser,toggleUserStatus} from '../../actions';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Navbar, Nav, NavItem, FormControl, Image, Button, ButtonGroup, Table, Pager } from 'react-bootstrap/lib/';

class TableRow extends Component{
    constructor(props){
        super(props)
        this.state = {
            showMenu : false
        }
        this.showMenu = this.showMenu.bind(this);   
        this.closeMenu = this.closeMenu.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.toggleUserStatus = this.toggleUserStatus.bind(this);
    }

    showMenu(event) {
        debugger
        event.preventDefault();
        this.setState({showMenu : true}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu(event) {
        debugger
        if(this.dropdownMenu){
        if(!this.dropdownMenu.contains(event.target)) {
            this.setState({showMenu : false}, () => {
                document.removeEventListener('click', event.target.innerHTML!=="Remove"?this.closeMenu:null);  
            });
        }
    }
    }

    toggleUserStatus(event){
        this.setState({showMenu : false});
        this.props.toggleUserStatus(this.props.user.u_id);
    }

    deleteUser(){
        debugger
        this.props.removeUser(this.props.user.u_id);
    }
    
    render(){
    const {user} = this.props;
    return(
    <tr>
        <td>{user.u_id}</td>
        <td>{user.name}</td>
        <td>{user.date_time}</td>
        <td>{user.status == true ? 'Enable': 'Disable' }</td>
        <td>
        <span bsSize="small">
        <Glyphicon  id={user.u_id} className="align-vertical" onClick={this.showMenu}  glyph="option-vertical" />
         { this.state.showMenu ? 
            (<div className="menu" ref={(element) => {this.dropdownMenu = element}}>
            <ButtonGroup id={user.u_id} >
                <Button name="edit" className="menuItem">Edit</Button>
                <Button name="remove" className="menuItem" onClick={this.deleteUser}>Remove</Button>
                <Button name="toggleStatus" onClick={this.toggleUserStatus}  className="menuItem">Toggle Status</Button>
                <Button name="details" className="menuItem">Details</Button>
            </ButtonGroup>
            </div>) : null  }
        </span>
        </td>
    </tr>
        )
    }
}

// function mapStateToProps({users}){
//     return {users}
// }

export default connect(null, {removeUser, toggleUserStatus})(TableRow);