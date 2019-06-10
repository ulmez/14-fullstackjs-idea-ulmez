import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationGradeCheck } from '../../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './DashboardPage.css';

class DashboardPage extends React.Component {
    componentWillMount() {
        authenticationGradeCheck(this);
    }

    render() {
        if(this.props.authorityGrade !== 1) {
            return (
                <div className="row pt-3">
                    <div className="dashboard-page still-loading-header col-12">Verifying authorization...</div>
                </div>
            );
        } else {
            return (
                <div className="row pt-3">
                    <div className="dashboard-page main-headline col-12">Dashboard</div>
                    <div className="dashboard-page smaller-headline col-12">Product Section</div>
                    <div className="dashboard-page smaller-headline col-12"><Link to="/addproduct">Add Product</Link></div>
                    <div className="dashboard-page smaller-headline col-12"><Link to="/editproductslist">Edit Products</Link></div>
                    <div className="dashboard-page smaller-headline col-12"><Link to="/deleteproducts">Delete Products</Link></div>

                    <div className="dashboard-page smaller-headline col-12 mt-2">User Section</div>
                    <div className="dashboard-page smaller-headline col-12"><Link to="/registration">Add User</Link></div>
                    <div className="dashboard-page smaller-headline col-12"><Link to="/edituserslist">Edit Users</Link></div>
                    <div className="dashboard-page smaller-headline col-12"><Link to="/deleteusers">Delete Users</Link></div>
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

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(DashboardPage));