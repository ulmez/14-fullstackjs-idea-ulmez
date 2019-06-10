import React from 'react';

import './Footer.css';

class Footer extends React.Component {
    render() {
        return (
            <footer className="container-fluid">
                <div className="footer background-blue row pb-3">
                    <div className="footer center-block">
                        <div className="row">
                            <div className="col-sm-4 col-xl-4 col-lg-4 col-md-4 mt-3">
                                <div className="footer headline col-12">CUSTOMER&nbsp;SERVIE</div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12">Login / New Customer</div>
                                        <div className="col-12">Order status</div>
                                        <div className="col-12">My Credentials</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 col-xl-4 col-lg-4 col-md-4 mt-3">
                                <div className="footer headline col-12">COMPANY</div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12">For Company</div>
                                        <div className="col-12">For Private</div>
                                        <div className="col-12">Register Company</div>
                                        <div className="col-12">Register Private</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 col-xl-4 col-lg-4 col-md-4 mt-3">
                                <div className="footer headline col-12">ABOUT US</div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12">About The Company</div>
                                        <div className="col-12">Work With Us</div>
                                        <div className="col-12">General Conditions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;