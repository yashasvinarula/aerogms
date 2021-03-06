import React, { Component } from 'react';
import {connect} from 'react-redux';
// import { Redirect } from 'react-router-dom';
import {removeUser,toggleUserStatus} from '../../actions';
import MediaQuery from 'react-responsive';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { DropdownButton, MenuItem, Image } from 'react-bootstrap/lib/';
import EnableLogo from '../../images/LayerVisible.png';
import DisableLogo from '../../images/LayerInvisible.png';

const UserMenuIcon = (
    <Glyphicon  className="align-vertical btn-menu" onClick={this.showMenu}  glyph="option-vertical" />
);

// const userNew = {
//     "u_id" : 1234,
//     "name" : 'Parveen Sahrawat',
//     "date_time" : '26 July, 2018',
//     "status" : true
// }

class TableRow extends Component{
    constructor(props){
        super(props)
        this.state = {
            showMenu : false,
            enableUser : false,
        }
        this.showMenu = this.showMenu.bind(this);   
        this.closeMenu = this.closeMenu.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.toggleUserStatus = this.toggleUserStatus.bind(this);
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
                document.removeEventListener('click', event.target.innerHTML!=="remove"?this.closeMenu:null);  
            });
        }
    }
    }

    toggleUserStatus(event){
        this.setState({showMenu : false});
        if(window.confirm(`Do you really want to toggle the status of user ${this.props.user.name}!`)){
            this.props.toggleUserStatus(this.props.user.u_id);
        }
    }

    deleteUser(){
        this.setState({showMenu : false});
        if(window.confirm(`Do you really want to delete user ${this.props.user.name}!`)){
        this.props.removeUser(this.props.user.u_id);
        }
    }
    
    render(){
    const {user} = this.props;
    // const user=userNew;         
    if(user !== "unauthorised" ) {
            return (
                <MediaQuery maxWidth={768}>
                    {(matches) => {
                        if(matches){
                            return (
                                <tr className="row">
                                <td className="col-sm-3 td-admin-mobile">{user.u_id}</td>
                                <td className="col-sm-3 td-admin-mobile">{user.name}</td>
                                <td className="col-sm-3 td-admin-mobile">{user.date_time}</td>
                                <td className="col-sm-3 td-admin-mobile">{user.status === true ? 
                                    <Image src={EnableLogo} onClick={this.toggleUserStatus} className="layer-on-off on-hover inline-display margin-outside" />
                                    : <Image src={DisableLogo} onClick={this.toggleUserStatus} className="layer-on-off on-hover inline-display margin-outside" />
                                     }
                                    <DropdownButton
                                        noCaret
                                        title={UserMenuIcon}    
                                        id={user.u_id}
                                        pullRight
                                    >
                                        {/* <MenuItem name="toggleStatus" className="" onClick={this.toggleUserStatus}>Toggle Status</MenuItem> */}
                                        <MenuItem name="remove" className="" onClick={this.deleteUser}>Remove</MenuItem>
                                    </DropdownButton>
                                </td>
                            </tr>
                            );
                        } else {
                            return (
                                <tr className="">
                                    <td className="col-sm-3 text-center">{user.u_id}</td>
                                    <td className="col-sm-3 text-center">{user.name}</td>
                                    <td className="col-sm-3 text-center">{user.date_time}</td>
                                    <td className="col-sm-3 text-center">{user.status === true ? 
                                        <Image src={EnableLogo} onClick={this.toggleUserStatus} className="layer-on-off on-hover inline-display margin-outside" />
                                        : <Image src={DisableLogo} onClick={this.toggleUserStatus} className="layer-on-off on-hover inline-display margin-outside" />
                                         }
                                    <DropdownButton
                                            noCaret
                                            title={UserMenuIcon}    
                                            id={user.u_id}
                                            pullRight
                                        >
                                            {/* <MenuItem name="toggleStatus" className="" onClick={this.toggleUserStatus}>Toggle Status</MenuItem> */}
                                            <MenuItem name="remove" className="" onClick={this.deleteUser}>Remove</MenuItem>
                                        </DropdownButton>
                                    </td>
                                </tr>
                            );
                        }
                    }}
                </MediaQuery>
               
            );
        } else {
            return null
        }
    }
}

// function mapStateToProps({users}){
//     return {users}
// }

export default connect(null, {removeUser, toggleUserStatus})(TableRow);