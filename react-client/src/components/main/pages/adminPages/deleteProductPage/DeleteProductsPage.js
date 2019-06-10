import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationGradeCheck } from '../../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './DeleteProductsPage.css';

class DeleteProductsPage extends React.Component {
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
            console.log(response.data);
            this.setState({
                products: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    removeProduct(productId) {
        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.post(`products/product/delete/${productId}`, null, tokenHeader)
        .then((product) => {
            console.log('Deleted product: ', product);
            axios.get('/products')
            .then((response) => {
                this.setState({
                    products: response.data
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
        if(this.state.products.length > 0) {
            return (
                <div className="row pt-3">
                    <div className="delete-products-page main-headline col-12">Choose product to delete</div>
                    <div className="delete-products-page smaller-headline col-12">Choose</div>
                    <div className="col-12">
                        {this.state.products.map((product) => (
                            <div key={product._id} className="row">
                                <div className="delete-products-page smaller-headline col-12">
                                    <i onClick={() => this.removeProduct(product._id)} className="delete-products-page red-text fa fa-times-circle-o pointer"></i> {product.name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
                        <Link to="/dashboard"><span className="delete-products-page smaller-headline">{'<< Back to dashboard'}</span></Link>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row pt-3">
                    <div className="delete-products-page main-headline col-12">Choose product to delete</div>
                    <div className="delete-products-page smaller-headline col-12">Choose</div>
                    <div className="delete-products-page smaller-headline col-12">No products to delete yet...</div>
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

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(DeleteProductsPage));