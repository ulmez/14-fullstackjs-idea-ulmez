import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationGradeCheck } from '../../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './EditUsersListPage.css';

class EditUsersListPage extends React.Component {
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
            this.setState({
                users: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="row pt-3">
                <div className="edit-users-list-page main-headline col-12">Choose user to edit</div>
                <div className="edit-users-list-page smaller-headline col-12">Choose</div>
                <div className="col-12">
                    {this.state.users.map((user) => (
                        user.authorityGrade !== 1 && <div key={user._id} className="row">
                            <div className="edit-users-list-page smaller-headline col-12"><Link to={"/editusers/" + user._id}>{user.username}</Link></div>
                        </div>
                    ))}
                </div>
                <div className="col-12">
                    <Link to="/dashboard"><span className="edit-users-list-page smaller-headline">{'<< Back to dashboard'}</span></Link>
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
        setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val))
    };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(EditUsersListPage));