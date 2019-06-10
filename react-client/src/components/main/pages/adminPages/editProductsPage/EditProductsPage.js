import React from 'react';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationGradeCheck } from '../../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../../../../../store/actions/headerAction';

import './EditProductsPage.css';
const $ = window.$;

class EditProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productName: '',
            price: '',
            description: '',
            image: '',
            categories: [],
            allCategories: [],
            productNameErrorMessage: '',
            priceErrorMessage: '',
            descriptionErrorMessage: '',
            imageErrorMessage: '',
            categoriesErrorMessage: '',
            axiosErrorMessage: '',
            successMessage: '',
            errorMessages: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        authenticationGradeCheck(this);

        let productId = this.props.match.params.id;
        Promise.all([axios.get('/categories'), axios.get(`/products/product/${productId}`)])
        .then((response) => {
            this.setState({
                productName: response[1].data.name,
                price: response[1].data.price,
                description: response[1].data.description,
                categories: response[1].data.categories,
                allCategories: response[0].data
            });

            let onlySelectedCategoryIds = [];

            this.state.categories.forEach((category) => {
                onlySelectedCategoryIds.push(category.category_id);
            });

            $('.selectpicker').val(onlySelectedCategoryIds);
            $('.selectpicker').selectpicker('refresh');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        var errorMessages = [];

        if(this.state.productName === "") {
            const message = '* Product name required';
            errorMessages.push(message);

            this.setState({
                productNameErrorMessage: message
            });
        }

        if(this.state.price === "") {
            const message = '* Price required';
            errorMessages.push(message);

            this.setState({
                priceErrorMessage: message
            });
        } else if(!Number.isInteger(parseInt(this.state.price, 10))) {
            const message = '* Price not numeric value';
            errorMessages.push(message);

            this.setState({
                priceErrorMessage: message
            });
        }

        if(this.state.description === "") {
            const message = '* Description required';
            errorMessages.push(message);

            this.setState({
                descriptionErrorMessage: message
            });
        }

        var allCategories = event.target.categories;
        var selectedCategories = [];
        for(var i = 0, l = allCategories.length; i < l; i++) {
            if(allCategories[i].selected) {
                selectedCategories.push({
                    category_id: allCategories[i].value,
                    category_name: allCategories[i].text
                });
            }
        }

        console.log(selectedCategories);

        this.setState({
            errorMessages: errorMessages
        });

        if(errorMessages.length === 0) {
            let formData = new FormData();

            formData.append('image', event.target.image.files[0]);
            formData.append('name', this.state.productName);
            formData.append('price', this.state.price);
            formData.append('description', this.state.description);
            formData.append('categories', JSON.stringify(selectedCategories));

            const token = localStorage.getItem('token');

            const tokenHeader = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            let productId = this.props.match.params.id;
            axios.post(`/products/product/update/${productId}`, formData, tokenHeader)
            .then((response) => {
                console.log(response);
                this.setState({
                    successMessage: 'Product successfully edited',
                    axiosErrorMessage: ''
                });

                setTimeout(() => {
                    this.setState({
                        successMessage: ''
                    });
                }, 5000);
            })
            .catch((error) => {
                console.log(error.response.data);
                this.setState({
                    successMessage: '',
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
            <div className="row pt-3">
                <div className="edit-products-page form-box-width mx-auto pb-2">
                    <div className="edit-products-page main-headline pb-3">
                        Edit Products
                    </div>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <div className="edit-products-page smaller-headline pb-3">
                            {this.state.productName === '' && <div className="edit-products-page red-text">{this.state.productNameErrorMessage}</div>}
                            <span className="edit-products-page smaller-headline">Product name</span>
                            <input type="text" name="productName" value={this.state.productName} onChange={this.handleChange} className="edit-products-page input-box-design" />
                        </div>
                        <div className="edit-products-page smaller-headline pb-3">
                            {(this.state.price === '' || !Number.isInteger(parseInt(this.state.price, 10))) && <div className="edit-products-page red-text">{this.state.priceErrorMessage}</div>}
                            <span className="edit-products-page smaller-headline">Price</span>
                            <input type="text" name="price" value={this.state.price} onChange={this.handleChange} className="edit-products-page input-box-design" />
                        </div>
                        <div className="edit-products-page smaller-headline pb-3">
                            {this.state.description === '' && <div className="edit-products-page red-text">{this.state.descriptionErrorMessage}</div>}
                            <span className="edit-products-page smaller-headline">Description</span>
                            <textarea name="description" value={this.state.description} rows="4" onChange={this.handleChange} className="edit-products-page textarea-box-design" />
                        </div>
                        <div className="edit-products-page smaller-headline pb-3">
                            <span className="edit-products-page smaller-headline">Image</span>
                            <input type="file" name="image" value={this.state.image} onChange={this.handleChange} className="edit-products-page input-box-design" />
                        </div>
                        <div className="edit-products-page smaller-headline pb-3">
                            <span className="edit-products-page smaller-headline">Categories</span>
                            <select id="selectCategories" name="categories" onChange={this.handleChange} className="selectpicker form-control" multiple data-selected-text-format="count">
                                {this.state.allCategories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="edit-products-page smaller-headline pb-2">
                            <button className="edit-products-page button-design button-text button-background-color-gradient">Edit</button>
                            {this.state.successMessage !== '' && <div className="edit-products-page green-text">{this.state.successMessage}</div>}
                            {this.state.axiosErrorMessage !== '' && <div className="edit-products-page red-text">{this.state.axiosErrorMessage}</div>}
                        </div>
                    </form>
                    <div>
                        <Link to="/editproductslist"><span className="edit-products-page smaller-headline">{'<< Back to edit products list'}</span></Link>
                    </div>
                    <div>
                        <Link to="/dashboard"><span className="edit-products-page smaller-headline">{'<< Back to dashboard'}</span></Link>
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
        setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val))
    };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(EditProductsPage));