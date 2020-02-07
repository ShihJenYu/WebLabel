import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import axios from 'axios';


import store from '../store';
import { Players } from './players/Players';
import { TabsPanels } from './tabspanels/TabsPanels';


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
