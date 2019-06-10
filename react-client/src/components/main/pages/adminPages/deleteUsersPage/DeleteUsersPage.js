import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationGradeCheck } from '../../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './DeleteUsersPage.css';

class DeleteUsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentWillMount() {
        authenticationGradeCheck(this);

        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.get('/users', tokenHeader)
        .then((response) => {
            console.log(response.data);
            this.setState({
                users: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    removeUser(userId) {
        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.post(`users/user/delete/${userId}`, null, tokenHeader)
        .then((user) => {
            console.log('Deleted user: ', user);

            axios.get('/users', tokenHeader)
            .then((response) => {
                this.setState({
                    users: response.data
                });
            })
            .catch((error2) => {
                console.log(error2);
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        if(this.state.users.length > 1) {
            return (
                <div className="row pt-3">
                    <div className="delete-users-page main-headline col-12">Choose user to delete</div>
                    <div className="delete-users-page smaller-headline col-12">Choose</div>
                    <div className="col-12">
                        {this.state.users.map((user) => (
                            user.authorityGrade !== 1 && <div key={user._id} className="row">
                                <div className="delete-users-page smaller-headline col-12">
                                    <i onClick={() => this.removeUser(user._id)} className="delete-users-page red-text fa fa-times-circle-o pointer"></i> {user.username}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
                        <Link to="/dashboard"><span className="delete-users-page smaller-headline">{'<< Back to dashboard'}</span></Link>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row pt-3">
                    <div className="delete-users-page main-headline col-12">Choose user to delete</div>
                    <div className="delete-users-page smaller-headline col-12">Choose</div>
                    <div className="delete-users-page smaller-headline col-12">No users to delete yet...</div>
                </div>
            );
        }
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

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(DeleteUsersPage));