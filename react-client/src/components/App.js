import React from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationStartCheck } from './helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade } from '../store/actions/headerAction';

import Header from './header/Header';
import Footer from './footer/Footer';
import NoMatch from './main/pages/NoMatch';
import MainContainer from './main/container/MainContainer';
import StartPage from './main/pages/startPage/StartPage';
import OrderPage from './main/pages/orderPage/OrderPage';
import LoginPage from './main/pages/loginPage/LoginPage';
import RegistrationPage from './main/pages/registrationPage/RegistrationPage';
import DashboardPage from './main/pages/adminPages/dashboardPage/DashboardPage';
import AddProductPage from './main/pages/adminPages/addProductPage/AddProductPage';
import EditProductsPage from './main/pages/adminPages/editProductsPage/EditProductsPage';
import EditProductsListPage from './main/pages/adminPages/editProductsListPage/EditProductsListPage';
import DeleteProductsPage from './main/pages/adminPages/deleteProductPage/DeleteProductsPage';
import EditUsersPage from './main/pages/adminPages/editUsersPage/EditUsersPage';
import EditUsersListPage from './main/pages/adminPages/editUsersListPage/EditUsersListPage';
import DeleteUsersPage from './main/pages/adminPages/deleteUsersPage/DeleteUsersPage';
import OrderListPage from './main/pages/orderListPage/OrderListPage';

import './App.css';

class App extends React.Component {
  componentWillMount() {
    authenticationStartCheck(this);
  }

  render() {
    return (
      <div>
        <Header />
        <MainContainer>
          <Switch>
              <Route exact path="/" component={StartPage} />
              <Route exact path="/order" component={OrderPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/registration" component={RegistrationPage} />
              <Route exact path="/dashboard" component={DashboardPage} />
              <Route exact path="/addproduct" component={AddProductPage} />
              <Route exact path="/editproducts/:id" component={EditProductsPage} />
              <Route exact path="/editproductslist" component={EditProductsListPage} />
              <Route exact path="/deleteproducts" component={DeleteProductsPage} />
              <Route exact path="/editusers/:id" component={EditUsersPage} />
              <Route exact path="/edituserslist" component={EditUsersListPage} />
              <Route exact path="/deleteusers" component={DeleteUsersPage} />
              <Route exact path="/orderlist/:id" component={OrderListPage} />
              <Route component={NoMatch} />
          </Switch>
        </MainContainer>
        <Footer />
      </div>
    );
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
      setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val))
  };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(App));