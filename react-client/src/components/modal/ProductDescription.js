import React from 'react';
import './ProductDescription.css';

class ProductDescription extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
            orderCheck: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetQuantity = this.resetQuantity.bind(this);
    }

    addDefaultSrc(ev){
        ev.target.src = 'https://dummyimage.com/400/999999/000000&text=No+Image+Found';
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    resetQuantity() {
        this.setState({
            quantity: 1
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const productObject = {
            product_id: this.props.product._id,
            quantity: this.state.quantity
        };

        let orderObject = {};

        if(JSON.parse(localStorage.getItem('order')) === null) {
            orderObject = {
                "products": [productObject]
            };
        } else {
            orderObject = JSON.parse(localStorage.getItem('order'));

            for(let i = 0; i < orderObject.products.length; i++) {
                if(orderObject.products[i].product_id === productObject.product_id) {
                    orderObject.products.splice(i, 1);
                    break;
                }
            }

            orderObject.products.push(productObject);
        }

        localStorage.setItem('order', JSON.stringify(orderObject));

        this.setState({
            orderCheck: true
        });

        setTimeout(() => {
            this.setState({
                orderCheck: false
            });
        }, 4000);

        console.log(JSON.parse(localStorage.getItem('order')));
    }

    render() {
        return (
            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="vertical-alignment-helper">
                    <div className="product-description modal-width modal-dialog vertical-align-center">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="product-description headline modal-title" id="myModalLabel">{this.props.product.name}</h4>
                                <button type="button" className="close" data-dismiss="modal" onClick={this.resetQuantity}><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                        <div className="product-description padding-bottom">
                                            <img className="product-description image-width-100-percent" onError={this.addDefaultSrc} src={'https://res.cloudinary.com/ulmezz/image/upload/w_400,h_400,c_limit/v1542482639/ulmezz-webshop/product-images/' + this.props.product._id} alt={this.props.product.name} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="product-description padding-bottom">
                                                <button className="product-description button-design button-text button-background-color-gradient">Add to Cart</button>
                                            </div>
                                            {this.state.orderCheck && <div className="product-description green-text">You have now placed an order in the cart</div>}
                                            <div>
                                                <div className="product-description headline-smaller">Quantity</div>
                                                <div className="product-description text-smaller padding-bottom">
                                                    <input type="number" min="1" value={this.state.quantity} onChange={this.handleChange} name="quantity" />
                                                </div>
                                                <div className="product-description headline-smaller">Price</div>
                                                <div className="product-description text-smaller padding-bottom">{this.props.product.price} kr</div>
                                                <div className="product-description headline-smaller">Description</div>
                                                <div className="product-description text-smaller">{this.props.product.description}</div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductDescription;