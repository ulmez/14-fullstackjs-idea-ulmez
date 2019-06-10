import React from 'react';
import './AlwaysBottomFooter.css';

class MainContainer extends React.Component {
    render() {
        return (
            <main className="main-component always-bottom-footer container-fluid">
                {this.props.children}
            </main>
        );
    }
}

export default MainContainer;