import React, { Component } from 'react';
import axios from 'axios';

class ResetPassword extends Component {
    constructor(){
        super();
        this.state = {
            newpassword : '',
            retypepassword : '',
            newpasswordValid : '',
            retypepasswordValid : '',
            formErrors : { newPassword : '', reEnteredPassword : '' },
            formValid : '',
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
        let newpasswordValid = this.state.newpasswordValid;
        let retypepasswordValid = this.state.retypepasswordValid;

        switch(fieldName) {
            case 'newPassword':
                newpasswordValid = value.length >= 3;
                fieldValidationErrors.newPassword = newpasswordValid ? '' : 'Password is too short';
                break; 
            case 'reEnteredPassword': 
                retypepasswordValid = value.length >= 3;
                fieldValidationErrors.reEnteredPassword = retypepasswordValid ? '' : 'Password is too short';
                break;
            default:
                break;  
        }
        this.setState({ formErrors : fieldValidationErrors,
                        newpasswordValid : newpasswordValid,
                        retypepasswordValid : retypepasswordValid}, this.validateForm);
    }

    validateForm() {
        this.setState({formValid : this.state.newpasswordValid && this.state.retypepasswordValid});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');

        axios
            .post('/resetPassword', {
                newPassword : this.state.newpassword,
                reEnteredPassword: this.state.retypepassword,
            })
            .then(response => {
                console.log('login response: ')
                console.log(response)
                if (response.status === 200) {
                    {this.props.unmountMe()};
                }
            }).catch(error => {
                console.log('login error: ')
                console.log(error);  
            })
    }

    render(){
        return (
            <div> 
                <form className="">
                    <div className="">
                        <div className="input-relative">
							<p className="invalid-input">{this.state.formErrors["newPassword"]}</p>
						</div>
                        <div className="">
                            <label className="" htmlFor="password">Enter New Password</label>
                        </div>
                        <div className="">
                            <input className="validate" placeholder="" type="password" name="newPassword" required={true}
                                value={this.state.password} onChange={this.handleChange} 
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
                                value={this.state.password} onChange={this.handleChange} 
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
        );
    }
}

export default ResetPassword;