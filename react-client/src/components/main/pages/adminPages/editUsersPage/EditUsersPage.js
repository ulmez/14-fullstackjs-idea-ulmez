import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './EditUsersPage.css';

class EditUsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            passwordConfirm: '',
            usernameErrorMessage: '',
            passwordErrorMessage: '',
            passwordConfirmErrorMessage: '',
            axiosErrorMessage: '',
            errorMessages: [],
            successMessage: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        if(this.props.authorityGrade === 1) {
            const userId = this.props.match.params.id;
            console.log(userId);

            const token = localStorage.getItem('token');

            const tokenHeader = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            axios.get(`/users/user/${userId}`, tokenHeader)
            .then((response) => {
                console.log(response.data);
                const userName = response.data.username;
                this.setState({
                    username: userName
                });
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            this.props.history.push("/login");
        }
    }
    
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        var errorMessages = [];
        const userId = this.props.match.params.id;

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
                password: this.state.password
            };

            const token = localStorage.getItem('token');

            const tokenHeader = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            axios.post(`/users/user/update/${userId}`, userItem, tokenHeader)
            .then((result) => {
                console.log(result.data);
                this.setState({
                    successMessage: 'User successfully updated'
                });

                setTimeout(() => {
                    this.setState({
                        successMessage: ''
                    });
                }, 4000);
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
        console.log(this.props.authorityGrade);
        return (
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                <div className="row pt-3">
                    <div className="edit-user-page form-box-width mx-auto">
                        <div className="edit-user-page main-headline pb-3">
                            Edit user
                        </div>
                        <div className="edit-user-page smaller-headline pb-3">
                            {this.state.username === '' && <div className="edit-user-page red-text">{this.state.usernameErrorMessage}</div>}
                            <span className="edit-user-page smaller-headline">Username</span>
                            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="edit-user-page input-box-design" />
                        </div>
                        <div className="edit-user-page smaller-headline pb-3">
                            {(this.state.password === '' || this.state.password.length < 6) && <div className="edit-user-page red-text">{this.state.passwordErrorMessage}</div>}
                            <span className="edit-user-page smaller-headline">Password</span>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="edit-user-page input-box-design" />
                            <span className="edit-user-page normal-text">* Password must be at least 6 characters.</span>
                        </div>
                        <div className="edit-user-page smaller-headline pb-3">
                            {(this.state.passwordConfirm === '' || this.state.passwordConfirm !== this.state.password) && <div className="edit-user-page red-text">{this.state.passwordConfirmErrorMessage}</div>}
                            <span className="edit-user-page smaller-headline">Re-enter password</span>
                            <input type="password" name="passwordConfirm" value={this.state.passwordConfirm} onChange={this.handleChange} className="edit-user-page input-box-design" />
                        </div>
                        <div className="edit-user-page smaller-headline pb-2">
                            <button className="edit-user-page button-design button-text button-background-color-gradient">Update user</button>
                            {this.state.successMessage !== '' && <div className="edit-user-page green-text">{this.state.successMessage}</div>}
                            {this.state.errorMessages.length > 0 && this.state.errorMessages.map((errorMessage, i) => <div className="edit-user-page red-text" key={i}>{errorMessage}</div>)}
                            {this.state.axiosErrorMessage !== '' && <div className="edit-user-page red-text">{this.state.axiosErrorMessage}</div>}
                        </div>
                        <div>
                            <Link to="/edituserslist"><span className="edit-user-page smaller-headline">{'<< Back to edit users list'}</span></Link>
                        </div>
                        <div>
                            <Link to="/dashboard"><span className="edit-user-page smaller-headline">{'<< Back to dashboard'}</span></Link>
                        </div>
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
        setLoggedOut: () => dispatch(setLoggedOut()),
        setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val))
    };
  };

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(EditUsersPage));