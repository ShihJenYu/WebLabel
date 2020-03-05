import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import { Players } from '../players/Players';
import { TabsPanels } from '../tabspanels/TabsPanels';

import {
    getAnnotations, patchAnnotations,
    getLabels, changeDefaultLabel, createObject,
} from '../../actions/annotations';

import MultipleSelect from '../myselect/MultipleSelect';

export class Annotation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        const token = localStorage.getItem('jwt_token');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
    }

    componentDidMount() {
        console.log('componentDidMount in Annotation');
        // TODO annotation need wait labels
        this.getData(1, 4);
    }

    async getData(projectID, taskID) {
        const { getAnnotations, getLabels } = this.props;
        console.log('getLabels start');
        await getLabels(projectID);
        console.log('getAnnotations start');
        await getAnnotations(taskID);
        console.log('ToDo write api for get batchs use pack id');
    }

    onChangeDefaultLabel = (e) => {
        const { changeDefaultLabel, labels } = this.props;
        console.log('test', e.target.value);
        const labelID = +Object.keys(labels).find((key) => (labels[key].name === e.target.value));

        changeDefaultLabel(labelID);
    }

    createNewTest = () => {
        const {
            createObject, defaultLabelID, labels, maxID,
        } = this.props;

        const selectedDefaultAttrs = labels[defaultLabelID].attributes;
        const attrs = {};

        Object.keys(selectedDefaultAttrs).forEach((attrID) => {
            attrs[attrID] = selectedDefaultAttrs[attrID].default_value;
        });

        const newObj = {
            id: `new_${(maxID + 1).toString()}`,
            frame: 0,
            shapetype: 'rectangle',
            shapeid: `new_${(maxID + 1).toString()}`,
            points: '100,100,150,150',
            label: +defaultLabelID,
            attrs,
        };
        createObject(newObj);
    }

    saveTest = () => {
        console.log('saveTest');
        const { annotations, patchAnnotations } = this.props;
        patchAnnotations(4, annotations);
    }

    render() {
        const { labels, defaultLabelID } = this.props;
        const labelItems = Object.values(labels).map((item) => item.name);
        const defaultLabel = (defaultLabelID != null) ? [labels[defaultLabelID].name] : [];
        return (
            <div className="container-fluid" style={{ height: '100%' }}>
                <div className="row" style={{ height: '100%' }}>
                    <div className="col d-flex flex-column h-100">
                        <div className="row" style={{ height: '34px', background: 'darksalmon' }}>
                            <MultipleSelect
                                items={labelItems}
                                value={defaultLabel}
                                onChange={this.onChangeDefaultLabel}
                            />
                            <input type="button" onClick={this.createNewTest} value="createNewTest" />
                            <input type="button" onClick={this.saveTest} value="saveTest" />
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
    patchAnnotations: PropTypes.func.isRequired,
    getLabels: PropTypes.func.isRequired,
    changeDefaultLabel: PropTypes.func.isRequired,
    labels: PropTypes.object,
    defaultLabelID: PropTypes.any,
    maxID: PropTypes.any,
    createObject: PropTypes.func.isRequired,
    annotations: PropTypes.any,

};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    labels: state.annotations.labels,
    defaultLabelID: state.annotations.defaultLabelID,
    maxID: state.annotations.maxID,
});

export default connect(
    mapStateToProps,
    {
        getAnnotations, patchAnnotations, getLabels, changeDefaultLabel, createObject,
    },
)(Annotation);
