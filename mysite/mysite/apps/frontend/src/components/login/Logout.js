import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        localStorage.removeItem('jwt_token');
        window.location.href = window.location.origin;
        return (
            null
        );
    }
}

export default connect(null, {})(Logout);
