import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import '../../App.css';
import BuildingsImage from '../../images/login-page-image.png'
import AeroLogo from '../../images/AeroLOGO.png';
import HomeFooter from '../footer-home';
import Navbar from '../navbar';
import Loader from '../loader';
import LoginForm from '../loginForm';



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
            redirectTo: null
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
        console.log(` handlesubmit ${event} is`);
        // document.addEventListener(event, () => {
        //     document.getElementsByClassName('preloader-background');

        // });
       
        axios
            .post('/api/login', {
                username: this.state.email,
                password: this.state.password
            })
            .then(response => {
                debugger
                console.log('login response: ')
                console.log(response)
                if (response.status === 200) {
                    // update App.js state
                    this.props.updateUser({
                        loggedIn: true,
                        username: response.data.userfname
                    })
                    // update the state to redirect to dashboard
                    this.setState({
                        redirectTo: '/dashboard'
                    })
                }
            }).catch(error => {
                if(error.response.status===401)
                {
                    alert('Please enter correct email and password!');
                }
                console.log(error);  
            })
    }
    
    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <div> 
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
                                <div className="col m1 offset m1"></div>
                            </div>
                        </div>  
                        <HomeFooter />      
                    </div>
                </div>
            )
        }
    }
}

export default Login;