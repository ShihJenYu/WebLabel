import React, { Component } from 'react';
import { connect } from 'react-redux';
import Projects from './Projects';
import Form from './Form';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <div className="container">
                    <br />
                    <div className="row">
                        <div className="col">
                            <Form />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Projects />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(null, {})(Dashboard);
