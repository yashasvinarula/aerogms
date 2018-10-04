import React, { Component } from 'react'
import Navbar from './navbar';
import axios from 'axios'
import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';

class Signup extends Component {
	constructor() {
		super()
		this.state = {
            firstName : '',
            lastName : '',
            username : '',
            email : '',
            mobile : '',
			password: '',
			confirmPassword: '',

		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
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
                    <img src={AeroLogo} className="img-logo"></img>
			        <form className="col s12">
				            <div className="row">
                                <div className="input-field col s6">
                                    <input className="validate" type="text" id="first-name"	name="firstName" placeholder=""
				    	            	value={this.state.firstName} onChange={this.handleChange}
				    	            />
                                    <label for="firstName">First name</label>
                                </div>
                                <div className="input-field col s6">
                                    <input className="validate" type="text" id="lasst-name"	name="lastName"	placeholder=""
					                	value={this.state.firstName} onChange={this.handleChange}
					                />
                                    <label for="lastName">Last name</label>
                                </div>
                                <div className="input-field col s12">
                                    <input className="validate" type="text" id="username" name="username" placeholder=""
                                        value={this.state.username} onChange={this.handleChange}
                                    />
                                    <label for="username">Username</label>
				                </div>
				            </div>
                            <div className="row">
                                <div className="input-field col s12">
					    	        <input className="validate"	type="email" id="email"	name="email" placeholder=""
					    	        	value={this.state.username}	onChange={this.handleChange}
					    	        />
                                    <label className="" for="email">Email address</label>
                                </div>
				            </div>
                            <div className="row">
                                <div className="input-field col s12">
						            <input className="validate" type="tel" id="mobile-number" name="mobile"	placeholder=""
							            value={this.state.mobile} onChange={this.handleChange}
						            />
                                    <label className="" for="mobile">Mobile number</label>
                                </div>
				            </div>
				            <div className="row">
                                <div className="input-field col s6">
                                    <input className="validate" placeholder="" type="password" name="password" 
                                        value={this.state.password}	onChange={this.handleChange}
						            />
                                    <label className="" for="password">Password</label>
                                </div>
                                <div className="input-field col s6">
						            <input className="validate"	placeholder="" type="password" name="confirmPassword"
							            value={this.state.confirmPassword} onChange={this.handleChange}
						            />	
                                    <label className="" for="password"> Confirm Password</label>
                                </div>
				            </div>	
				            <div className="row">
				                <div className="">
				                    <button className="btn btn col s12" onClick={this.handleSubmit} type="submit">Continue</button>
                                </div>
				            </div>
                            <small className="center">By clicking 'Continue' you agree to the <span><a>Terms</a></span> and <span><a>Privacy Policy</a></span></small>
                            <p className="center">Already have an Account? <span><a href="/login">Login</a></span></p>
                    </form>
            </div>
			    <div className="col m4 offset m4"></div>
		    </div>
        </div>
	)
}
}

export default Signup