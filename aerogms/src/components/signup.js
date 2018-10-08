import React, { Component } from 'react'
import axios from 'axios'
import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
// import FormErrors from './formErrors';

class Signup extends Component {
	constructor() {
		super()
		this.state = {
            firstName : '',
            lastName : '',
            // username : '' ,
            email : '',
            mobile : '',
			password: '',
			confirmPassword: '',
			formErrors : { firstName : '', lastName : '', email : '', mobile : '', password : '', confirmPassword : '', passwordMatch : false, },
			firstNameValid : false,
			lastNameValid : false,
			emailValid : false,
			mobileValid : false,
			passwordValid : false,
			confirmPasswordValid : false,
			formValid : false,
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({ [name]: value }, () => { this.validateField(name, value) });
	}

	validateField(fieldname, value) {
		let fieldValidationErrors = this.state.formErrors;
		let firstNameValid = this.state.firstNameValid;
		let lastNameValid = this.state.lastNameValid;
		let emailValid = this.state.emailValid;
		let mobileValid = this.state.mobileValid;
		let passwordValid = this.state.passwordValid;
		let confirmPasswordValid = this.state.confirmPasswordValid;

		switch(fieldname) {
			case 'firstName':
				firstNameValid = value.length>=3 && value.match(/^[a-zA-Z]*$/); 
				fieldValidationErrors.firstName = firstNameValid ? '' : ' First name should be of atleast 3 characters ';
				break;
			// case 'lastName':
			// 	lastNameValid = value.length >= 3;
			// 	fieldValidationErrors.lastName = lastNameValid ? '' : ' Last name should be of atleast 3 characters ';
			// 	break;
			case 'email':
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				fieldValidationErrors.email = emailValid ? '' : ' Please enter valid email address ';
				break;
			case 'mobile': 
				mobileValid = value.match(/^([0|[0-9]{1,5})?([6-9][0-9]{9})$/);
				fieldValidationErrors.mobile = mobileValid ? '' : 'Please enter valid mobile number';
				break;
			case 'password': 
				passwordValid = value.length >= 6;
				fieldValidationErrors.password = passwordValid ? '' : ' Password should be of atleast 6 characters ';
				break;
			case 'confirmPassword':
				confirmPasswordValid = value.length >= 6;
				fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : ' Confirm Password should be of atleast 6 characters ';
				break;
			default: 
				break;
		}
		if( this.state.password === this.state.confirmPassword )
			// this.state.passwordMatch = true;
		this.setState({ formErrors : fieldValidationErrors,
								firstNameValid : firstNameValid,
								lastNameValid : lastNameValid,
								emailValid : emailValid,
								mobileValid : mobileValid,
								passwordValid : passwordValid,
								confirmPasswordValid : confirmPasswordValid,
							 }, this.validateForm)
	}
	validateForm() {
		this.setState({ formValid : this.state.firstNameValid && this.state.emailValid 
			&& this.state.mobileValid && this.state.passwordValid && this.state.confirmPasswordValid 
			&& (this.state.password === this.state.confirmPassword)});
	}

	handleSubmit(event) {
		console.log('sign-up handleSubmit, username: ')
		console.log(this.state.username)
		event.preventDefault()

		//request to server to add a new username/password
		axios.post('/user/', {
			email : this.state.email,
			password : this.state.password
		})
			.then(response => {
				console.log(response)
				if (!response.data.errmsg) {
					console.log('successful signup')
					this.setState({ //redirect to login page
						redirectTo: '/login'
					})
				} else {
					console.log('username already taken')
				}
			}).catch(error => {
				console.log('signup error: ')
				console.log(error)

			})
	}

render() {
	return (
        <div>
		    <div className="row" id="home">
                <div className="col m4 offset m4"></div>
                <div className="col m4 border-css">
                    <img src={AeroLogo} alt="Aero Logo" className="img-logo"></img>
			        <div>
						{/* <FormErrors formErrors={this.state.formErrors} /> */}
					</div>
					<div className="col s1 offset s1"></div>
					<form className="col s10">
				            <div className="row">
                                <div className=" input-margin col s6">
									<div className="input-relative">
										<p className="invalid-input">{this.state.formErrors["firstName"]}</p>
									</div>
									<label htmlFor="firstName">First name</label>
                                    <input className="validate" type="text" id="first-name"	name="firstName" required={true} placeholder=""
				    	            	value={this.state.firstName} onChange={this.handleChange}
				    	            />
                                </div>
                                <div className=" input-margin col s6">
									<label htmlFor="lastName">Last name</label>
                                    <input className="validate" type="text" id="lasst-name"	name="lastName"	placeholder=""
					                	value={this.state.lastName} onChange={this.handleChange}
					                />
                                </div>
								{/* <div className=" col s12">
									<label htmlFor="username">Username</label>
                                    <input className="validate" type="text" id="username" name="username" placeholder=""
                                        value={this.state.username} onChange={this.handleChange}
                                    />
                                    
				                </div> */}
				            </div>
                            <div className="row">
                                <div className=" input-margin col s12">
									<p className="invalid-input">{this.state.formErrors["email"]}</p>
									<label className="" htmlFor="email">Email address</label>
					    	        <input className="validate"	type="email" id="email"	name="email" required={true} placeholder=""
					    	        	value={this.state.username}	onChange={this.handleChange}
					    	        />
                                </div>
				            </div>
                            <div className="row">
                                <div className=" input-margin col s12">
									<label className="" htmlFor="mobile">Mobile number</label>
						            <input className="validate" type="tel" id="mobile-number" name="mobile" required={true}	placeholder=""
							            value={this.state.mobile} onChange={this.handleChange}
						            />
                                </div>
				            </div>
				            <div className="row">
                                <div className=" input-margin col s6">
									<label className="" htmlFor="password">Password</label>
                                    <input className="validate" placeholder="" type="password" name="password" required={true} 
                                        value={this.state.password}	onChange={this.handleChange}
						            />
                                </div>
                                <div className=" input-margin col s6">
									<label className="" htmlFor="password"> Confirm Password</label>
						            <input className="validate"	placeholder="" type="password" name="confirmPassword" required={true}
							            value={this.state.confirmPassword} onChange={this.handleChange}
						            />	
                                </div>
				            </div>	
				            <div className="row">
				                <div className="">
				                    <button className="btn btn col s12" disabled={!this.state.formValid} onClick={this.handleSubmit} type="submit">Continue</button>
                                </div>
				            </div>
                            <small className="center">By clicking 'Continue' you agree to the <span><a>Terms</a></span> and <span><a>Privacy Policy</a></span></small>
                            <p className="center">Already have an Account? <span><a href="/login">Login</a></span></p>
                    </form>
					<div className="col s1 offset s1"></div>
            	</div>
			    <div className="col m4 offset m4"></div>
		    </div>
        </div>
	)
}
}

export default Signup