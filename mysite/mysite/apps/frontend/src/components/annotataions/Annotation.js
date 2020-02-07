import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import axios from 'axios';


import store from '../../store';
import { Players } from '../players/Players';
import { TabsPanels } from '../tabspanels/TabsPanels';

import { getAnnotations, getLabels } from '../../actions/annotations';


export class Annotation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        const token = localStorage.getItem('jwt_token');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
    }

    componentDidMount() {
        console.log('componentDidMount in Annotation');
        const { getAnnotations, getLabels } = this.props;
        getAnnotations();
        getLabels(1);
    }

    render() {
        return (
            <div className="container-fluid" style={{ height: '100%' }}>
                <div className="row" style={{ height: '100%' }}>
                    <div className="col d-flex flex-column h-100">
                        <div className="row" style={{ height: '34px', background: 'darksalmon' }}>
                            header
                        </div>
                        <div className="row  flex-grow-1" style={{ background: 'slategray' }}>
                            middle
                        </div>
                        <Players />
                    </div>
                    <div className="col" style={{ maxWidth: '350px', background: 'cadetblue' }}>
                        <TabsPanels />
                    </div>
                </div>
            </div>

        );
    }
}

Annotation.propTypes = {
    getAnnotations: PropTypes.func.isRequired,
    getLabels: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    labels: state.annotations.labels,
});

export default connect(mapStateToProps, { getAnnotations, getLabels })(Annotation);
