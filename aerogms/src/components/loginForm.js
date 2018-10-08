import React, { Component } from 'react'

import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import BuildingsImage from '../images/login-page-image.png'
import LoginForm from'./Login/login-form';
import Forgot from './Login/forgotPassword';
import ResetPassword from './Login/reset-password';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderLogin : false,
            renderForgot : false,
            renderReset : true,
        }
        this.loginWillMount = this.loginWillMount.bind(this);
        this.forgotWillMount = this.forgotWillMount.bind(this);
        this.resetWillMount = this.resetWillMount.bind(this);
    }
    
    loginWillMount() {
        this.setState({ renderReset : false , renderLogin : true, renderForgot : false });
    }
    forgotWillMount() {
        this.setState({ renderLogin : false, renderForgot : true , renderReset : false });
    }
    resetWillMount() {
        this.setState({ renderForgot : false , renderReset : true, renderLogin : false });
    }
    
    render() {
        return (
            <div>
                <div className="top-margin">
                    <div className="row">
                        <div className="col m1 offset m1"></div>
                        <div className="col m5">
                            <h3 className="center">Welcome to AeroGMS</h3>
                            <hr className="hr-row"></hr>
                            <p className="center">Geographic Management System is a framework for city administrators to collect, 
                                analyze and extract useful information for cities and towns. It encompasses all
                                 aspects of management and planning process in an organization from servey to 
                                 advanced analytics.
                            </p>
                            <img src={BuildingsImage} alt="buildings" className="buildings-image"></img>
                        </div>
                        <div className="col m1 offset m1"></div>
                        <div className="col m1 offset m1"></div>
                        <div className="col m3 border-css form-height side-margin">
                        
                            <img src={AeroLogo} alt="Aero Logo" className="img-logo"></img>
                            { this.state.renderLogin ? <LoginForm unmountMe={this.forgotWillMount} /> : null }
                            { this.state.renderForgot ? <Forgot unmountMe={this.resetWillMount} /> : null }
                            { this.state.renderReset ? <ResetPassword unmountMe={this.loginWillMount} /> : null }
                        </div>
                        <div className="col m1 offset m1"></div>
                    </div>
                </div>        
            </div>
        )
    }
}

export default Login;