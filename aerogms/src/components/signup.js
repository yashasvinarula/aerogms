import React, { Component } from 'react'
import axios from 'axios'

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
		<div className="SignupForm">
			<h4>Sign up</h4>
			<form className="form-horizontal">
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="firstName">First name</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							type="text"
							id="first-name"
							name="firstName"
							placeholder=""
							value={this.state.firstName}
							onChange={this.handleChange}
						/>
					</div>
				</div>
                <div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="lastName">Last name</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							type="text"
							id="last-name"
							name="lastName"
							placeholder=""
							value={this.state.lastName}
							onChange={this.handleChange}
						/>
					</div>
				</div>
                <div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="username">Username</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							type="text"
							id="username"
							name="username"
							placeholder=""
							value={this.state.username}
							onChange={this.handleChange}
						/>
					</div>
				</div>
                <div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="email">Email address</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							type="email"
							id="email"
							name="email"
							placeholder=""
							value={this.state.username}
							onChange={this.handleChange}
						/>
					</div>
				</div>
                <div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="mobile">Mobile number</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							type="mobile"
							id="mobile-number"
							name="mobile"
							placeholder=""
							value={this.state.mobile}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="password">Password</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							placeholder=""
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
						/>
					</div>
				</div>
                <div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="password"> Confirm Password</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							placeholder=""
							type="password"
							name="confirmPassword"
							value={this.state.confirmPassword}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="form-group ">
					<div className="col-7"></div>
					<button
						className="btn btn-primary col-1 col-mr-auto"
						onClick={this.handleSubmit}
						type="submit"
					>Sign up</button>
				</div>
			</form>
		</div>

	)
}
}

export default Signup