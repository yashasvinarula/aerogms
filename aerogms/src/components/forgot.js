import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import BuildingsImage from '../images/login-page-image.png';
import Navbar from './navbar';
import HomeFooter from './footer-home';
// import Loader from './loader';

class Forgot extends Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            emailValid : '',
            formError : { email : '' },
            redirectTo:null
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
        let emailValid = this.state.emailValid;
        let fieldValidationError = this.state.formError;
        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationError.email = emailValid ? '' : 'Email is invalid';
                break; 
            default:
                break;  
        }
        this.setState({ emailValid : emailValid });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');

        axios
            .post('/api/forgot', {
                email : this.state.email
            })
            .then(response => {
                debugger
                console.log('forgot password response: ')
                alert(response.data.message);
                if (response.status === 200) {
                    this.setState({redirectTo:'/reset'});
                }
            }).catch(error => {
                debugger
                alert(error.response.data.message)
                console.log('forgot password error: ')
            })
    }

    render(){
        if(this.state.redirectTo)
        {
            return <Redirect to={{pathname:this.state.redirectTo}}/>
        }
        return (
             <div>
                <Navbar />
                <div className="top-margin">
                    <div className="row">
                        <div className="col-md-1 offset-md-1"></div>
                        <div className="col-md-5">
                            <h3 className="text-center">Welcome to AeroGMS</h3>
                            <hr className="hr-row"></hr>
                            <p className="text-center">Geographic Management System is a framework for city administrators to collect, 
                                analyze and extract useful information for cities and towns. It encompasses all
                                 aspects of management and planning process in an organization from servey to 
                                 advanced analytics.
                            </p>
                            <img src={BuildingsImage} alt="buildings" className="buildings-image"></img>
                        </div>
                        {/* <Loader /> */}
                        <div className="col-md-1 offset-md-1"></div>
                        <div className="col-md-1 offset-md-1"></div>
                        <div className="col-md-3 border-css form-height side-margin">
                        
                        <img src={AeroLogo} alt="Aero Logo" className="img-logo"></img>
                        <div>
                            <form>
                                <div className="">
                                    <div className="input-relative">
                                        <p className="invalid-input">{this.state.formError["email"]}</p>
                                    </div>
                                    <div className="">
                                        <label className="" htmlFor="username">Enter Email</label>
                                    </div>
                                    <div className="">
                                        <input className="validate" type="email" id="email" name="email" required={true} placeholder=""
                                            value={this.state.username} onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="">
                                        <button className="btn btn-auth col s12" disabled={!this.state.emailValid} onClick={this.handleSubmit} type="submit">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        </div>
                        <div className="col-md-1 offset-md-1"></div>
                    </div>
                </div>  
                <HomeFooter />      
            </div>
        );
    }
}

export default Forgot;