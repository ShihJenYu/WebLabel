import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log('submit Login', this.state);

        const { username, password } = this.state;
        const data = { username, password };

        axios.post(`${window.location.origin}/api-token-auth/`, data)
            .then((res) => { // then print response status
                console.log(res, 'is work');
                localStorage.setItem('jwt_token', res.data.token);
                window.location.href = window.location.origin;

                // 200 save data.token
                // others status not working
            });
    }


    render() {
        const { username, password } = this.state;
        return (
            <div className="container">
                <h2>Login</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter username"
                            name="username"
                            value={username}
                            onChange={this.onChange}
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={this.onChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default connect(null, {})(Login);
