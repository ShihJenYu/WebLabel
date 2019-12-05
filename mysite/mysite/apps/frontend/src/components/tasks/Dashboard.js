import React, { Fragment } from 'react';
import Tasks from './Tasks';
import Form from './Form';

export default function Dashboard() {
    return (
        <Fragment>
            <Form />
            <Tasks />
        </Fragment>
    )
}

