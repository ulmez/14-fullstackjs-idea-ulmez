import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setLoggedIn, setLoggedOut } from '../../../../store/actions/headerAction';

import './RegistrationPage.css';

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            socialSecurityNumber: '',
            address: '',
            postalCode: '',
            phoneHome: '',
            phoneMobile: '',
            email: '',
            username: '',
            password: '',
            passwordConfirm: '',
            firstNameErrorMessage: '',
            lastNameErrorMessage: '',
            socialSecurityNumberErrorMessage: '',
            addressErrorMessage: '',
            postalCodeErrorMessage: '',
            phoneHomeErrorMessage: '',
            usernameErrorMessage: '',
            passwordErrorMessage: '',
            passwordConfirmErrorMessage: '',
            axiosErrorMessage: '',
            errorMessages: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        var errorMessages = [];

        if(this.state.firstName === "") {
            const message = '* First name required';
            errorMessages.push(message);

            this.setState({
                firstNameErrorMessage: message
            });
        }

        if(this.state.lastName === "") {
            const message = '* Last name required';
            errorMessages.push(message);

            this.setState({
                lastNameErrorMessage: message
            });
        }

        if(this.state.socialSecurityNumber === "") {
            const message = '* Social security number required';
            errorMessages.push(message);

            this.setState({
                socialSecurityNumberErrorMessage: message
            });
        }

        if(this.state.address === "") {
            const message = '* Address required';
            errorMessages.push(message);

            this.setState({
                addressErrorMessage: message
            });
        }

        if(this.state.postalCode === "") {
            const message = '* Postal code required';
            errorMessages.push(message);

            this.setState({
                postalCodeErrorMessage: message
            });
        }

        if(this.state.phoneHome === "") {
            const message = '* Phone number home required';
            errorMessages.push(message);

            this.setState({
                phoneHomeErrorMessage: message
            });
        }

        if(this.state.username === "") {
            const message = '* Username required';
            errorMessages.push(message);

            this.setState({
                usernameErrorMessage: message
            });
        }

        if(this.state.password === "") {
            const message = '* Password required';
            errorMessages.push(message);

            this.setState({
                passwordErrorMessage: message
            });
        } else if(this.state.password.length < 6) {
            const message = '* Password must be at least 6 characters';
            errorMessages.push(message);

            this.setState({
                passwordErrorMessage: message
            });
        }

        if(this.state.passwordConfirm === "") {
            const message = '* Confirm password required';
            errorMessages.push(message);

            this.setState({
                passwordConfirmErrorMessage: message
            });
        } else if(this.state.passwordConfirm !== this.state.password) {
            const message = '* Confirm password not same as password';
            errorMessages.push(message);

            this.setState({
                passwordConfirmErrorMessage: message
            });
        }

        this.setState({
            errorMessages: errorMessages
        });

        if(errorMessages.length === 0) {
            const userItem = {
                username: this.state.username,
                password: this.state.password,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                social_security_number: this.state.socialSecurityNumber,
                address: this.state.address,
                postal_code: this.state.postalCode,
                phone_home: this.state.phoneHome,
                phone_mobile: this.state.phoneMobile,
                email: this.state.email
            };

            axios.post('/users/user/register', userItem)
            .then((result) => {
                console.log(result.data);

                const item = {
                    username: this.state.username,
                    password: this.state.password
                };

                axios.post('/users/user/login', item)
                .then((res) => {
                    console.log(res.data);

                    localStorage.setItem('token', res.data.token);

                    this.props.setLoggedIn();
                    this.props.history.push("/");
                })
                .catch((err) => {
                    console.log(err.response.data);
                });
            })
            .catch((error) => {
                console.log(error.response.data);
                this.setState({
                    axiosErrorMessage: error.response.data.message
                });
            });
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                <div className="row pt-3">
                    <div className="registration-page form-box-width mx-auto pb-2">
                        <div className="registration-page main-headline pb-3">
                            Register account
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.firstName === '' && <div className="registration-page red-text">{this.state.firstNameErrorMessage}</div>}
                            <span className="registration-page smaller-headline">First name</span>
                            <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.lastName === '' && <div className="registration-page red-text">{this.state.lastNameErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Last name</span>
                            <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.socialSecurityNumber === '' && <div className="registration-page red-text">{this.state.socialSecurityNumberErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Social security number</span>
                            <input type="text" name="socialSecurityNumber" value={this.state.socialSecurityNumber} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.address === '' && <div className="registration-page red-text">{this.state.addressErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Address</span>
                            <input type="text" name="address" value={this.state.address} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.postalCode === '' && <div className="registration-page red-text">{this.state.postalCodeErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Postal code</span>
                            <input type="text" name="postalCode" value={this.state.postalCode} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.phoneHome === '' && <div className="registration-page red-text">{this.state.phoneHomeErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Home number</span>
                            <input type="text" name="phoneHome" value={this.state.phoneHome} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            <span className="registration-page smaller-headline">Mobile number</span>
                            <input type="text" name="phoneMobile" value={this.state.phoneMobile} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            <span className="registration-page smaller-headline">Email</span>
                            <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {this.state.username === '' && <div className="registration-page red-text">{this.state.usernameErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Username</span>
                            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {(this.state.password === '' || this.state.password.length < 6) && <div className="registration-page red-text">{this.state.passwordErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Password</span>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="registration-page input-box-design" />
                            <span className="registration-page normal-text">* Password must be at least 6 characters.</span>
                        </div>
                        <div className="registration-page smaller-headline pb-3">
                            {(this.state.passwordConfirm === '' || this.state.passwordConfirm !== this.state.password) && <div className="registration-page red-text">{this.state.passwordConfirmErrorMessage}</div>}
                            <span className="registration-page smaller-headline">Re-enter password</span>
                            <input type="password" name="passwordConfirm" value={this.state.passwordConfirm} onChange={this.handleChange} className="registration-page input-box-design" />
                        </div>
                        <div className="registration-page smaller-headline pb-2">
                            <button className="registration-page button-design button-text button-background-color-gradient">Create your account</button>
                            {this.state.errorMessages.length > 0 && this.state.errorMessages.map((errorMessage, i) => <div className="registration-page red-text" key={i}>{errorMessage}</div>)}
                            {this.state.axiosErrorMessage !== '' && <div className="registration-page red-text">{this.state.axiosErrorMessage}</div>}
                        </div>
                        {(this.props.authorityGrade !== 1) && <div>
                            <span className="registration-page normal-text">
                                Already have an account? <Link to="/login"><span className="registration-page sign-in-span-width">Sign in</span><i className="fa fa-caret-right"></i></Link>
                            </span>
                        </div>}
                        {(this.props.authorityGrade === 1) && <div>
                            <Link to="/dashboard"><span className="registration-page smaller-headline">{'<< Back to dashboard'}</span></Link>
                        </div>}
                    </div>
                </div>
            </form>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
      isLoggedIn: store.hr.isLoggedIn,
      authorityGrade: store.hr.authorityGrade
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: () => dispatch(setLoggedIn()),
        setLoggedOut: () => dispatch(setLoggedOut())
    };
  };

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(RegistrationPage));