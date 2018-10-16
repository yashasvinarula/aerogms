import React, { Component } from 'react';

class UserDetail extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                 <div id="mySidebar" className="sidebar">
                    <a href="javascript:void(0)" className="closebtn" onClick="closeNav()">X</a>
                    <p>Project 1</p>
                </div>
                <div id="main">

                </div>
            </div>
        );
    }
}

export default UserDetail;