import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import BuildingsImage from '../images/login-page-image.png'
import Navbar from './navbar';
import HomeFooter from './footer-home';
import Loader from './loader';

class ResetPassword extends Component {
    constructor(){
        super();
        this.state = {
            token : '',
            newPassword : '',
            retypepassword : '',
            tokenValid : '',
            newpasswordValid : '',
            retypepasswordValid : '',
            formErrors : { token:'', newPassword : '', reEnteredPassword : '' },
            formValid : '',
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
        let fieldValidationErrors = this.state.formErrors;
        let tokenValid = this.state.tokenValid;
        let newpasswordValid = this.state.newpasswordValid;
        let retypepasswordValid = this.state.retypepasswordValid;

        switch(fieldName) {
            case 'token':
            tokenValid = value.length > 0;
            fieldValidationErrors.token = tokenValid ? '' : 'Token is too short';
            break; 

            case 'newPassword':
                newpasswordValid = value.length >= 6;
                fieldValidationErrors.newPassword = newpasswordValid ? '' : 'Password is too short';
                break; 
            case 'reEnteredPassword': 
                retypepasswordValid = (this.state.newPassword === this.state.reEnteredPassword)
                fieldValidationErrors.reEnteredPassword = retypepasswordValid ? '' : 'Password is not matched';
                break;
            default:
                break;  
        }
        this.setState({ formErrors : fieldValidationErrors,
                        tokenValid:tokenValid,
                        newpasswordValid : newpasswordValid,
                        retypepasswordValid : retypepasswordValid}, this.validateForm);
    }

    validateForm() {
        this.setState({formValid : this.state.newpasswordValid && this.state.retypepasswordValid && this.state.tokenValid});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');
        axios
            .post('/api/reset', {
                token : this.state.token,
                newPassword : this.state.newPassword
            })
            .then(response => {
                debugger;
                alert(response.data.message);
                console.log('login response: ')
                console.log(response)
                if (response.status === 200) {
                   this.setState({redirectTo:'/login'});
                }
            }).catch(error => {
                debugger
                alert(error.response.data.message)
                console.log('login error: ')
                console.log(error);  
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
                        {/* <div className="input-relative">
							<p className="invalid-input">{this.state.formErrors["newPassword"]}</p>
						</div> */}
                        <div className="">
                            <label className="" htmlFor="password">Enter Token</label>
                        </div>
                        <div className="">
                            <input className="validate" placeholder="" type="password" name="token" required={true}
                                value={this.state.token} onChange={this.handleChange} 
                            />
                        </div>

                         <div className="input-relative">
							<p className="invalid-input">{this.state.formErrors["newPassword"]}</p>
						</div>
                        <div className="">
                            <label className="" htmlFor="password">Enter New Password</label>
                        </div>
                        <div className="">
                            <input className="validate" placeholder="" type="password" name="newPassword" required={true}
                                value={this.state.newPassword} onChange={this.handleChange} 
                            />
                        </div>

                        <div className="input-relative">
							<p className="invalid-input">{this.state.formErrors["reEnterPassword"]}</p>
						</div>
                        <div className="">
                            <label className="" htmlFor="password">Re-enter Password</label>
                        </div>
                        <div className="">
                            <input className="validate" placeholder="" type="password" name="reEnteredPassword" required={true}
                                value={this.state.reEnteredPassword} onChange={this.handleChange} 
                            />
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            <button className="btn btn-auth col s12" disabled={!this.state.formValid} onClick={this.handleSubmit} type="submit">Submit</button>
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
        );
    }
}

export default ResetPassword;