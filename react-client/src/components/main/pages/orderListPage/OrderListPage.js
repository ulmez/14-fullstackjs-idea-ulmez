import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationCheck } from '../../../helpers/users';
import { setUserId } from '../../../../store/actions/headerAction';

import './OrderListPage.css';

class OrderListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orders: ''
        };
    }

    componentWillMount() {
        authenticationCheck(this);

        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.get(`/orders/order/user/${this.props.match.params.id}`, tokenHeader)
        .then((response) => {
            console.log(response.data);

            response.data.forEach((order) => {
                let totalSum = 0;
                order.products.forEach((product) => {
                    console.log(product.price);
                    totalSum += (product.price * product.quantity);
                });
                console.log(totalSum);
                order.totalSum = totalSum;

                const formatedDate = new Date(order.date).toISOString().slice(0,10);
                
                order.date = formatedDate;
            });

            this.setState({
                orders: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        console.log(this.state.orders);

        if(this.state.orders === '') {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="pt-3 pb-3 col-12">
                                <div className="row">
                                    <div className="order-list-page header col pb-3">Order lists</div>
                                </div>
                                <div className="row">
                                    <div className="order-list-page col pt-3">Loading orders...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if(this.state.orders.length === 0) {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="pt-3 pb-3 col-12">
                                <div className="row">
                                    <div className="order-list-page header col pb-3">Order lists</div>
                                </div>
                                <div className="row">
                                    <div className="order-list-page col pt-3">You have no orders yet...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="order-list-page row">
                    <div className="col-12">
                        <div className="row">
                            <div className="pt-3 pb-3 col-12">
                                <div className="row">
                                    <div className="order-list-page header col pb-3">Orders list</div>
                                </div>
                                {this.state.orders.map((order) => (
                                    <div key={order._id} className="row">
                                        <div className="col pt-3"><span className="order-list-page under-header">Order date:</span> {order.date}</div>
                                        {order.products.map((product, index) => (
                                            <div key={index} className="col-12">
                                                <div className="row">
                                                    <div className="col-6"><span className="order-list-page under-header">Name:</span> {product.product_name}</div>
                                                    <div className="col-2"><span className="order-list-page under-header">Quantity:</span> {product.quantity}</div>
                                                    <div className="col-2"><span className="order-list-page under-header">Price:</span> {product.price} kr</div>
                                                    <div className="col-2"><span className="order-list-page under-header">Summary:</span> {product.quantity * product.price} kr</div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-12">
                                            <span className="order-list-page under-header">Total summary:</span> {order.totalSum} kr
                                        </div>
                                        <div className="order-list-page liner col-12 pt-3"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserId: (val) => dispatch(setUserId(val))
    };
};

export default withRouter(connect(null, mapDispatchToProps)(OrderListPage));