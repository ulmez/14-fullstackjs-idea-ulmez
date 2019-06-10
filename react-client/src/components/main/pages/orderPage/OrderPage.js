import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationCheck } from '../../../helpers/users';
import { setLoggedIn, setLoggedOut, setUserId } from '../../../../store/actions/headerAction';

import './OrderPage.css';

class OrderPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            priceSummary: 0,
            successMessage: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        authenticationCheck(this);

        console.log(localStorage.getItem('order'));
        const products = localStorage.getItem('order') !== null ? JSON.parse(localStorage.getItem('order')).products : '';
        const productsTemp = [];
        let summary = 0;

        if(products !== '') {
            products.forEach((product, index) => {
                axios.get(`/products/product/${product.product_id}`)
                .then((result) => {
                    result.data.quantity = parseInt(products[index].quantity, 10);
                    summary += result.data.price * result.data.quantity;

                    productsTemp.push(result.data);

                    this.setState({
                        products: productsTemp,
                        priceSummary: summary
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        } else {
            this.setState({
                products: ''
            });
        }
    }

    addQuantity(index) {
        const productsTemp = this.state.products;
        let summaryTemp = 0;
        let localStorageObjectTemp = {
            products: []
        };

        productsTemp[index].quantity++;

        productsTemp.forEach((product) => {
            summaryTemp += product.price * product.quantity;

            localStorageObjectTemp.products.push({
                product_id: product._id,
                quantity: product.quantity
            });
        });

        localStorage.setItem('order', JSON.stringify(localStorageObjectTemp));

        this.setState({
            products: productsTemp,
            priceSummary: summaryTemp
        });
    }

    subQuantity(index) {
        const productsTemp = this.state.products;
        let summaryTemp = 0;
        let localStorageObjectTemp = {
            products: []
        };

        if(productsTemp[index].quantity > 1) {
            productsTemp[index].quantity--;
        }
        
        productsTemp.forEach((product) => {
            summaryTemp += product.price * product.quantity;

            localStorageObjectTemp.products.push({
                product_id: product._id,
                quantity: product.quantity
            });
        });

        localStorage.setItem('order', JSON.stringify(localStorageObjectTemp));

        this.setState({
            products: productsTemp,
            priceSummary: summaryTemp
        });
    }

    addDefaultSrc(ev) {
        ev.target.src = 'https://dummyimage.com/50/999999/000000&text=No+Image';
    }

    handleSubmit() {
        console.log(this.state);

        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.post('/users/user/auth', null, tokenHeader)
        .then((tokenPackage) => {
            let sendOrderObject = {};
            sendOrderObject.user_id = tokenPackage.data.userId;
            sendOrderObject.products = [];

            this.state.products.forEach((product) => {
                sendOrderObject.products.push({
                    product_id: product._id,
                    product_name: product.name,
                    quantity: product.quantity,
                    price: product.price
                });
            });

            console.log(sendOrderObject);

            axios.post('/orders/order/add', sendOrderObject, tokenHeader)
            .then((response) => {
                console.log(response.data);
                localStorage.removeItem('order');
                this.setState({
                    successMessage: 'Order successfully created'
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

    removeProduct(id) {
        const products = this.state.products;
        const localProducts = JSON.parse(localStorage.getItem('order'));

        products.splice(id, 1);
        localProducts.products.splice(id, 1);

        this.setState({
            products: products
        });

        const orderedProductsStringified = JSON.stringify(localProducts);

        if(localProducts.products.length > 0) {
            localStorage.setItem('order', orderedProductsStringified);
        } else {
            localStorage.removeItem('order');
        }
    }

    render() {
        console.log(this.state.products);
        if(this.state.products === '' || this.state.successMessage !== '') {
            return (
                <div className="row pt-3">
                    {this.state.successMessage === '' ? <div className="order-page col">You haven't made any order yet...</div> : <div className="order-page still-loading-header col">{this.state.successMessage}</div>}
                </div>
            );
        } else if(this.state.products.length === 0) {
            return (
                <div className="row pt-3">
                    <div className="order-page still-loading-header col">
                        Loading ordered products...
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="order-page border-bottom-black headline col-12 pt-3 pb-3">Order Information</div>
                    {this.state.products.map((product, id) => (
                        <div key={product._id} className="col-12 pt-3">
                            <div className="order-page headline-smaller row-block-design mx-auto">
                                <div className="order-page headline-smaller pb-1">Cart</div>
                                <div className="order-page product-info-block float-left-new">
                                    <div className="order-page float-left pr-3">
                                        <img onError={this.addDefaultSrc} src={'https://res.cloudinary.com/ulmezz/image/upload/w_50,h_50,c_limit/v1542482639/ulmezz-webshop/product-images/' + product._id} alt={product.name} />
                                    </div>
                                    <div>
                                        <div><a href="/">{product.name}</a></div>
                                        <div>{product.price} kr</div>
                                    </div>
                                </div>
                                <div className="order-page headline-smaller text-right">
                                    <i className="order-page border-icon fa fa-minus pointer" onClick={() => this.subQuantity(id)}></i>
                                    <span className="order-page border-quantity-text">{product.quantity}</span>
                                    <i className="order-page border-icon fa fa-plus pointer" onClick={() => this.addQuantity(id)}></i>
                                    <i className="order-page border-icon fa fa-trash margin-left pointer" onClick={() => this.removeProduct(id)}></i>
                                    <span className="order-page text-color-red padding-left">{product.price * product.quantity} kr</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-12 pt-3">
                        <div className="order-page headline-smaller row-block-design mx-auto">
                            <div className="order-page summary-block float-right">
                                <div className="order-page headline-smaller">
                                    <div className="order-page float-left text-left pb-2">
                                        <span className="order-page">Summary</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="order-page text-color-red padding-left">{this.state.priceSummary} kr</span>
                                    </div>
                                    <div>
                                        <button onClick={this.handleSubmit} className="order-page button-design button-text button-background-color-gradient">Make order</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStoreToProps = (store) => {
    return {
        isLoggedIn: store.hr.isLoggedIn
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: () => dispatch(setLoggedIn()),
        setLoggedOut: () => dispatch(setLoggedOut()),
        setUserId: (val) => dispatch(setUserId(val))
    };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(OrderPage));