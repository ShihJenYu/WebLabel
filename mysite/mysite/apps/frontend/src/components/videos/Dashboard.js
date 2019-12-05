import React, { Fragment } from 'react';
import Videos from './Videos';
import Form from './Form';
import Uploader from './Uploader';

export default function Dashboard() {
    return (
        <Fragment>
            <Form />
            <Uploader />
            <Videos />
        </Fragment>
    )
}

