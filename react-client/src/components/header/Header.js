import React from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setLoggedIn, setLoggedOut, setSearchedProducts, setNumberOfPages, setUrlEndpoint, setAuthorityGrade } from '../../store/actions/headerAction';

import './Header.css';
import logo from '../../images/navbar-logo.png';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownSelection: {
                name: 'All',
                id: ''
            },
            categories: [],
            searchText: '',
            userId: null
        };

        this.searchButton = this.searchButton.bind(this);
        this.getSearchText = this.getSearchText.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        axios.get('/categories')
        .then((response) => {
            console.log(response.data);
            this.setState({
                categories: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    selectedCategory(item) {
        console.log(item.target.id);
        console.log(item.target.text);
        
        this.setState({
            dropdownSelection: {
                name: item.target.text,
                id: item.target.id
            }
        });
    }

    searchButton() {
        let typeOfSearch = '';

        if(this.state.dropdownSelection.id !== '' && this.state.searchText !== '') {
            typeOfSearch = '/scores/score/average/search/idname';
        } else if(this.state.dropdownSelection.id === '' && this.state.searchText !== '') {
            typeOfSearch = '/scores/score/average/search/name';
        } else if(this.state.dropdownSelection.id !== '' && this.state.searchText === '') {
            typeOfSearch = '/scores/score/average/search/id';
        } else {
            typeOfSearch = '/scores/score/average/all';
        }

        const categoryId = this.state.dropdownSelection.id !== '' ? `/${this.state.dropdownSelection.id}` : '';
        const productSearchText = this.state.searchText !== '' ? `/${this.state.searchText}` : '';

        typeOfSearch += categoryId + productSearchText;

        console.log(typeOfSearch);

        Promise.all([axios.get(typeOfSearch), axios.get(`${typeOfSearch}/2/0`)])
        .then((response) => {
            console.log(response[0].data);
            console.log(response[1].data);

            this.props.setUrlEndpoint(`${typeOfSearch}/2`);

            this.props.setSearchedProducts(response[1].data.message);

            console.log(this.props.seachedProducts);

            const arrTemp = [];
            const numberOfPages = parseFloat(response[0].data.message.length / 2);

            console.log(numberOfPages);

            for(let i = 0; i < numberOfPages; i++) {
                arrTemp.push(i);
            }

            console.log(arrTemp);

            this.props.setNumberOfPages(arrTemp);
            
            console.log(this.props.numberOfPages);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    logout() {
        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
    
        axios.post('/users/user/logout', null, tokenHeader)
        .then((res) => {
            console.log(res);
            localStorage.removeItem('token');
            this.props.setAuthorityGrade(0);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    getSearchText(e) {
        this.setState({
            searchText: e.target.value
        });
    }

    render() {
        return (
            <div>
                <header className="container-fluid">
                    <div className="row">
                        <div className="header background-white col">
                            <div className="row pt-3 pb-2">
                                <div className="header hide-block col text-right"></div>
                                <div className="header my-search-bar col">
                                    <div className="header my-icon-width">
                                        <img src={logo} alt="UlmeZZ Webshop" />
                                    </div>
                                    <div className="header my-search-bar-width input-group">
                                        <div className="input-group-prepend">
                                            <button className="header dropdown-list btn btn-light dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.dropdownSelection.name}</button>
                                            <div className="header dropdown-list dropdown-menu" onClick={(e) => this.selectedCategory(e)}>
                                                <a className="dropdown-item">All</a>
                                                {this.state.categories.map((category) => (
                                                    <a key={category._id} id={category._id} className="dropdown-item">{category.name}</a>
                                                ))}
                                            </div>
                                        </div>
                                        <input type="text" onChange={this.getSearchText} value={this.state.searchText} className="header dropdown-list form-control" placeholder="Search..." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                        <div className="input-group-append">
                                            <span className="header search-button input-group-text mr-4" id="basic-addon2" onClick={this.searchButton}>
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col text-left"></div>
                            </div>
                        </div>
                    </div>
                </header>
                <nav className="header navbar navbar-height navbar-expand-lg navbar-dark bg-dark-blue"></nav>
                <div className="header background-white cart-block-position">
                    {this.props.isLoggedIn !== "" && <span className="header medium-text bold-text pr-2">
                        <Link to="/">Start</Link>
                    </span>}
                    {(this.props.isLoggedIn !== "" && this.props.isLoggedIn) && <span className="header medium-text bold-text pr-2">
                        <Link to={'/orderlist/' + this.props.userId}>Order List</Link>
                    </span>}
                    {(this.props.isLoggedIn !== "" && this.props.isLoggedIn) && <span className="header medium-text bold-text pr-2">
                        <Link to="/" onClick={this.logout}>Logout</Link>
                    </span>}
                    {(this.props.isLoggedIn !== "" && !this.props.isLoggedIn) && <span className="header medium-text bold-text pr-2">
                        <Link to="/login">Login</Link>
                    </span>}
                    {(this.props.isLoggedIn !== "" && !this.props.isLoggedIn) && <span className="header medium-text bold-text pr-2">
                        <Link to="/registration">Register</Link>
                    </span>}
                    {(this.props.isLoggedIn !== "" && this.props.isLoggedIn && this.props.authorityGrade === 1) && <span className="header medium-text bold-text pr-2">
                        <Link to="/dashboard">Dashboard</Link>
                    </span>}
                    <span className="header medium-text bold-text">
                        <Link to="/order"><i className="header larger-text fa fa-shopping-cart"></i> Cart</Link>
                    </span>
                </div>
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        isLoggedIn: store.hr.isLoggedIn,
        authorityGrade: store.hr.authorityGrade,
        seachedProducts: store.hr.seachedProducts,
        numberOfPages: store.hr.numberOfPages,
        userId: store.hr.userId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: () => dispatch(setLoggedIn()),
        setLoggedOut: () => dispatch(setLoggedOut()),
        setSearchedProducts: (val) => dispatch(setSearchedProducts(val)),
        setNumberOfPages: (val) => dispatch(setNumberOfPages(val)),
        setUrlEndpoint: (val) => dispatch(setUrlEndpoint(val)),
        setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val))
    };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Header));