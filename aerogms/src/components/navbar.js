import React, { Component } from 'react';

import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
import '../App.css';
import AeroLogoHeader from '../images/AeroLogoHeader.png'

class Navbar extends Component {
    render(){
        return (
            <div>
                <div>
                    <img src={AeroLogoHeader} alt="Aero Logo" className="header-logo"></img>
                </div>
                <nav className="home-nav">
                    <div className="">
                      <ul className="row">
                        <li className="col m4 center"><a href="/login">Home</a></li>
                        <li className="col m4 center"><a href="/about">About</a></li>
                        <li className="col m4 center"><a href="/contact">Contact us</a></li>
                      </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;