import React, { Fragment } from 'react';
import Projects from './Projects';
import Form from './Form';

export default function Dashboard() {
    return (
        <Fragment>
            <div className="container">
                <br></br>
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
        </Fragment>
    )
}

