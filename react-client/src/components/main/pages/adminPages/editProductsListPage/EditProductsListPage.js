import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationGradeCheck } from '../../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './EditProductsListPage.css';

class EditProductsListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: []
        };
    }

    componentWillMount() {
        authenticationGradeCheck(this);

        axios.get('/products')
        .then((response) => {
            this.setState({
                products: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="row pt-3">
                <div className="edit-products-list-page main-headline col-12">Choose product to edit</div>
                <div className="edit-products-list-page smaller-headline col-12">Choose</div>
                <div className="col-12">
                    {this.state.products.map((product) => (
                        <div key={product._id} className="row">
                            <div className="edit-products-list-page smaller-headline col-12"><Link to={"/editproducts/" + product._id}>{product.name}</Link></div>
                        </div>
                    ))}
                </div>
                <div className="col-12">
                    <Link to="/dashboard"><span className="edit-products-list-page smaller-headline">{'<< Back to dashboard'}</span></Link>
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

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(EditProductsListPage));