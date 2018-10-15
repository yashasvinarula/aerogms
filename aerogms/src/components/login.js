import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import BuildingsImage from '../images/login-page-image.png'
import Navbar from './navbar';
import HomeFooter from './footer-home';
import Loader from './loader';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            formErrors : { email : '', password : ''},
            emailValid : false,
            passwordValid : false,
            formValid : false,
            redirectTo: '/dashboard'
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value }, () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' Email is invalid ';
                break; 
            case 'password': 
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : 'Password is too short';
                break;
            default:
                break;  
        }
        this.setState({ formErrors : fieldValidationErrors,
                        emailValid : emailValid,
                        passwordValid : passwordValid}, this.validateForm);
    }

    validateForm() {
        this.setState({formValid : this.state.emailValid && this.state.passwordValid});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(`handlesubmit ${event} is`);
        // document.addEventListener(event, () => {
        //     document.getElementsByClassName('preloader-background');

        // });
        this.props.doLogin(this.state.email, this.state.password);
        this.setState({ password:""});
    }
    render() {
        //debugger
        const {userDetails} = this.props;
        console.log(userDetails);
        if(userDetails.isLoggedIn){
            console.log(this.props.userDetails.username);
            //this.props.history.push('/dashboard');
            return <Redirect to='/dashboard' />
        }
        if(!userDetails.isLoggedIn && (userDetails.error != ""))
        {
            console.log('in case of error: '+ userDetails.error);
            alert('Please enter correct email and password!');
            userDetails.error = "";
        }
        return (
                <div>
                <Navbar />
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
                        {/* <Loader /> */}
                        <div className="col m1 offset m1"></div>
                        <div className="col m1 offset m1"></div>
                        <div className="col m3 border-css form-height side-margin">
                        
                            <img src={AeroLogo} alt="Aero Logo" className="img-logo"></img>
                            <div> 
                    <form className="">
                        <div className="">
                            <div className="input-relative">
						    	<p className="invalid-input">{this.state.formErrors["email"]}</p>
						    </div>
                            <div className="">
                                <label className="" htmlFor="username">Enter Username</label>
                            </div>
                            <div className="">
                                <input className="validate" type="email" id="email" name="email" required={true} placeholder=""
                                    value={this.state.username} onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="">
                            <div className="input-relative">
						    	<p className="invalid-input">{this.state.formErrors["password"]}</p>
						    </div>
                            <div className="">
                                <label className="" htmlFor="password">Enter Password</label>
                            </div>
                            <div className="">
                                <input className="validate" placeholder="" type="password" name="password" required={true}
                                    value={this.state.password} onChange={this.handleChange} 
                                />
                            </div>
                            <div className="right">
                                <a href="/forgot">Forgot?</a>
                            </div>
                        </div>
                        <div className="">
                            <div className="">
                                <button className="btn btn-auth col s12" disabled={!this.state.formValid} onClick={this.handleSubmit} type="submit">Login</button>
                            </div>
                            <div className="">
                                <a href="/signup" className="btn col s12">New User? Sign up</a>
                            </div>
                        </div>
                    </form>
                </div>
                        </div>
                        <div className="col m1 offset m1"></div>
                    </div>
                </div>  
                <HomeFooter />      
            </div>
            )
    }
}

export default Login;