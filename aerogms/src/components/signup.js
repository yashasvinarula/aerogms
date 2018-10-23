import React, { Component } from 'react';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import '../App.css';
import Navbar from './navbar';
import AeroLogo from '../images/AeroLOGO.png';
// import FormErrors from './formErrors';

class Signup extends Component {
	constructor() {
		super()
		this.state = {
            firstName : '',
            lastName : '',
            //username : '',
            email : '',
            mobile : '',
			password: '',
			confirmPassword: '',
			formErrors : { firstName : '', lastName : '', email : '', mobile : '', password : '', confirmPassword : '' },
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
			case 'email':
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				fieldValidationErrors.email = emailValid ? '' : ' Please enter valid email address ';
				break;
			case 'mobile': 
				mobileValid = value.match(/^[6-9][0-9]{9}$/);
				fieldValidationErrors.mobile = mobileValid ? '' : 'Please enter valid mobile number';
				break;
			case 'password': 
				passwordValid = value.length >= 6;
				fieldValidationErrors.password = passwordValid ? '' : ' Password should be of atleast 6 characters ';
				break;
			case 'confirmPassword':
				confirmPasswordValid = (this.state.password === this.state.confirmPassword)
				fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : ' Password and Confirm Password aren\'t matchig ';
				break;
			default: 
				break;
		}
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
		this.setState({ formValid : this.state.firstNameValid && this.state.emailValid && this.state.mobileValid && this.state.passwordValid && this.state.confirmPasswordValid && (this.state.password === this.state.confirmPassword)});
	}

	handleSubmit(event) {
		console.log('sign-up handleSubmit, username: ')
		console.log(this.state.username)
		event.preventDefault()

		//request to server to add a new username/password
		axios.post('/api/signup', {
			firstName : this.state.firstName,
			lastName : this.state.lastName,
			email : this.state.email,
			mobile : this.state.mobile,
			password : this.state.password
		})
			.then(response => {
				console.log(response);
				debugger;
				//alert(response.data.message);
				if (response.data) {
					if(response.data.message === 'Email exists')
					{
						alert('Email-id already exists!');
						return;
					}
					console.log('successful signup')
					alert(response.data.message);
					this.setState({ //redirect to login page
						redirectTo: '/login'
					})
					//window.location.href = '/login'
				}
			}).catch(error => {
				console.log('signup error: ' + error)
				if(error.response.data.constraint === 'uk_mobile')
				{
					alert('Mobile number is already exist!');
				}
			})
	}

	render() {
	if(this.state.redirectTo){
		return <Redirect to={{ pathname: this.state.redirectTo }} />
	}
	return (
		<MediaQuery maxWidth={768}>
			{(matches) => {
				if(matches) {
					return (
						<div>
						<Navbar />
						<div className="" id="home">
							<div className="border-css">
								<h3 className="text-center">Create your account</h3>
								<div className="form-css"></div>
								<form className="">
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["firstName"]}</p>
												</div>
												<label htmlFor="firstName">First name</label>
												<input className="validate" type="text" id="first-name"	name="firstName" required={true} placeholder=""
													value={this.state.firstName} onChange={this.handleChange}
												/>
											</div>
											<div className="">
												<label htmlFor="lastName">Last name</label>
												<input className="validate" type="text" id="lasst-name"	name="lastName"	placeholder=""
													value={this.state.lastName} onChange={this.handleChange}
												/>
											</div>
										</div>
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["email"]}</p>
												</div>											
												<label className="" htmlFor="email">Email address</label>
												<input className="validate"	type="email" id="email"	name="email" required={true} placeholder=""
													value={this.state.username}	onChange={this.handleChange}
												/>
											</div>
										</div>
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["mobile"]}</p>
												</div>
												<label className="" htmlFor="mobile">Mobile number</label>
												<input className="validate" type="tel" id="mobile-number" name="mobile" required={true}	placeholder=""
													value={this.state.mobile} onChange={this.handleChange}
												/>
											</div>
										</div>
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["password"]}</p>
												</div>
												<label className="" htmlFor="password">Password</label>
												<input className="validate" placeholder="" type="password" name="password" required={true} 
													value={this.state.password}	onChange={this.handleChange}
												/>
											</div>
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["confirmPassword"]}</p>
												</div>
												<label className="" htmlFor="password"> Confirm Password</label>
												<input className="validate"	placeholder="" type="password" name="confirmPassword" required={true}
													value={this.state.confirmPassword} onChange={this.handleChange}
												/>	
											</div>
										</div>	
										<small className="text-center">By clicking 'Continue' you agree to the <span><a>Terms</a></span> and <span><a>Privacy Policy</a></span></small>
										<div className="">
											<div className="">
												<button className="btn btn-auth" disabled={!this.state.formValid} onClick={this.handleSubmit} type="submit">Continue</button>
											</div>
										</div>
										<p className="text-center">Already have an Account? <span><a href="/login">Login</a></span></p>
								</form>
								<div className=""></div>
							</div>
							<div className=""></div>
						</div>
					</div>
					);
				} else {
					return (
						<div>
						<Navbar />
						<div className="container" id="home">
							<div className="row">
							<div className="col-md-4 offset-md-4"></div>
							<div className="border-css col-md-4">
								<img src={AeroLogo} alt="Aero Logo" className="img-logo"></img>
								<div className=""></div>
								<form className="">
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["firstName"]}</p>
												</div>
												<label htmlFor="firstName">First name</label>
												<input className="validate" type="text" id="first-name"	name="firstName" required={true} placeholder=""
													value={this.state.firstName} onChange={this.handleChange}
												/>
											</div>
											<div className="">
												<label htmlFor="lastName">Last name</label>
												<input className="validate" type="text" id="last-name"	name="lastName"	placeholder=""
													value={this.state.lastName} onChange={this.handleChange}
												/>
											</div>
										</div>
										<div className="">
											<div className="">
												<p className="invalid-input">{this.state.formErrors["email"]}</p>
												<label className="" htmlFor="email">Email address</label>
												<input className="validate"	type="email" id="email"	name="email" required={true} placeholder=""
													value={this.state.username}	onChange={this.handleChange}
												/>
											</div>
										</div>
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["mobile"]}</p>
												</div>
												<label className="" htmlFor="mobile">Mobile number</label>
												<input className="validate" type="tel" id="mobile-number" name="mobile" required={true}	placeholder=""
													value={this.state.mobile} onChange={this.handleChange}
												/>
											</div>
										</div>
										<div className="">
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["password"]}</p>
												</div>
												<label className="" htmlFor="password">Password</label>
												<input className="validate" placeholder="" type="password" name="password" required={true} 
													value={this.state.password}	onChange={this.handleChange}
												/>
											</div>
											<div className="">
												<div className="input-relative">
													<p className="invalid-input">{this.state.formErrors["confirmPassword"]}</p>
												</div>
												<label className="" htmlFor="password"> Confirm Password</label>
												<input className="validate"	placeholder="" type="password" name="confirmPassword" required={true}
													value={this.state.confirmPassword} onChange={this.handleChange}
												/>	
											</div>
										</div>	
										<small className="text-center">By clicking 'Continue' you agree to the <span><a>Terms</a></span> and <span><a>Privacy Policy</a></span></small>
										<div className="">
											<div className="">
												<button className="btn btn-auth" disabled={!this.state.formValid} onClick={this.handleSubmit} type="submit">Continue</button>
											</div>
										</div>
										<p className="text-center">Already have an Account? <span><a href="/login">Login</a></span></p>
								</form>
								<div className=""></div>
							</div>
							<div className="col-md-4"></div>
							</div>
						</div>
					</div>
					);
				}
			}}
		</MediaQuery>

	)
	}
}

export default Signup