import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { setLoggedIn, setLoggedOut, setAuthorityGrade, setUserId } from '../../../../store/actions/headerAction';

import './LoginPage.css';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            usernameErrorMessage: '',
            passwordErrorMessage: '',
            axiosErrorMessage: '',
            successMessage: '',
            errorMessages: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toRegistration = this.toRegistration.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        var errorMessages = [];

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
        }

        this.setState({
            errorMessages: errorMessages
        });

        if(errorMessages.length === 0) {
            const item = {
                username: this.state.username,
                password: this.state.password
            };

            axios.post('/users/user/login', item)
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('token', res.data.token);
                this.props.setLoggedIn();

                const token = localStorage.getItem('token');

                const tokenHeader = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };

                axios.post('/users/user/username', {
                    username: this.state.username
                }, tokenHeader)
                .then((user) => {
                    console.log(user.data[0]);
                    this.props.setAuthorityGrade(user.data[0].authorityGrade);
                    this.props.setUserId(user.data[0]._id);
                    this.props.history.push("/");
                })
                .catch((error) => {
                    console.log(error);
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    axiosErrorMessage: err.response.data.message
                });
            });
        }
    }

    toRegistration() {
        this.props.history.push("/registration");
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div className="row pt-3">
                <div className="login-page form-box-width mx-auto">
                    <div className="login-page main-headline pb-3">
                        Sign in
                    </div>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <div className="login-page smaller-headline pb-3">
                            {this.state.username === '' && <div className="login-page red-text">{this.state.usernameErrorMessage}</div>}
                            <span className="login-page smaller-headline">Username</span>
                            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="login-page input-box-design" />
                        </div>
                        <div className="login-page smaller-headline pb-3">
                            {this.state.password === '' && <div className="login-page red-text">{this.state.passwordErrorMessage}</div>}
                            <span className="login-page smaller-headline">Password</span>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="login-page input-box-design" />
                        </div>
                        <div className="login-page smaller-headline pb-2">
                            <button className="login-page button-design button-text button-background-color-gradient">Login</button>
                            {this.state.axiosErrorMessage !== '' && <div className="login-page red-text">{this.state.axiosErrorMessage}</div>}
                        </div>
                    </form>
                    <div className="login-page bottom-border-gray pb-3"></div>
                    <div className="pt-3 pb-3">
                        <button onClick={this.toRegistration} className="login-page button-design button-text button-background-color-gray">Create a new account here</button>
                    </div>
                </div>
            </div>
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
        setLoggedOut: () => dispatch(setLoggedOut()),
        setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val)),
        setUserId: (val) => dispatch(setUserId(val))
    };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(LoginPage));