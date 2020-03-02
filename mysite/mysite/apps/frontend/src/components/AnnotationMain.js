import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect, Provider } from 'react-redux';
import axios from 'axios';

import store from '../store';
import Annotation from './annotataions/Annotation';


export class AnnotationMain extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        const token = localStorage.getItem('jwt_token');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
    }

    render() {
        return (
            <Provider store={store}>
                <Annotation />
            </Provider>
        );
    }
}

export default connect(null, {})(AnnotationMain);
ReactDom.render(<AnnotationMain />, document.getElementById('annotation_main'));
