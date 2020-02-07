import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';


import {
    Accordion, Card,
} from 'react-bootstrap';
import { IconButton } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';

import MultipleSelect from '../myselect/MultipleSelect';
import AttributeInput from '../myselect/AttributeInput';

import { changeLabel, changeAttr } from '../../actions/annotations';

export class AttributesPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { testCheck: false };
    }

    // 34px is right tab height, 25px is Accordion.Toggle height
    // 'calc(100vh - 34px)'
    // 'calc(100vh - 301px)'  301 is tmp sample 267(include 3*(25+64))+34

    handleChange = (event) => {
        this.setState({
            testCheck: event.target.checked,
        });
    };

    onChangeLabel = (e) => {
        const { changeLabel, labels, selectedObject } = this.props;
        console.log('test', e.target.value);
        const labelID = +Object.keys(labels).find((key) => (labels[key].name === e.target.value));
        const selectedDefaultAttrs = labels[labelID].attributes;
        const attrs = {};

        Object.keys(selectedDefaultAttrs).forEach((attrID) => {
            attrs[attrID] = selectedDefaultAttrs[attrID].default_value;
        });

        // objID, labelID, attrs
        changeLabel(selectedObject.id, labelID, attrs);
    }
    onChangeAttr = (e, type, attrID) => {
        const { selectedObject, changeAttr } = this.props;
        let attrValue = null;
        switch (type) {
            case 'checkbox':
                console.log('checkbox', e.target.checked.toString());
                attrValue = e.target.checked.toString();
                break;
            case 'select':
                console.log('select', e.target.value);
                attrValue = e.target.value;
                break;
            case 'multiselect':
                console.log('multiselect', e.target.value);
                attrValue = e.target.value;
                break;
            case 'text':
                console.log('text', e.target.value.toString());
                attrValue = e.target.value.toString();
                break;
            case 'number':
                console.log('number', e.target.value);
                attrValue = e.target.value.toString();
                break;
            default:
                break;
        }
        if (attrValue != null) {
            changeAttr(selectedObject.id, attrID, attrValue);
        }
    }

    render() {
        const {
            testCheck,
        } = this.state;

        const { labels, selectedObject } = this.props;
        console.log('labels, selectedObject', labels, selectedObject);
        // TODO selectedObject will change by object panel

        // selectedObject decied content attribute

        let panelContent = null;
        const attrsContent = null;

        const labelItems = Object.values(labels).map((item) => item.name);
        let tmp = [];
        if (selectedObject.id > -1 && selectedObject.label > -1) {


            const attrs = labels[selectedObject.label].attributes;


            // TODO content need pass value to child


            Object.keys(attrs).forEach((attrID) => {
                let content = null;
                switch (attrs[attrID].attrtype) {
                    case 'checkbox':
                        {
                            const flag = selectedObject.attrs[attrID].toLowerCase() !== 'false';
                            content = (
                                <Checkbox
                                    className="p-0"
                                    checked={flag}
                                    onChange={(e) => { this.onChangeAttr(e, 'checkbox', attrID); }}
                                    size="small"
                                />
                            );
                        }
                        break;
                    case 'select':
                        {
                            let val = [];
                            if (typeof selectedObject.attrs[attrID] === 'string') {
                                val = selectedObject.attrs[attrID].split(';').map((item) => item.trim());
                            } else {
                                val = selectedObject.attrs[attrID];
                            }
                            val = val.filter((item) => item !== '');

                            content = (
                                <MultipleSelect
                                    value={val}
                                    onChange={(e) => { this.onChangeAttr(e, 'select', attrID); }}
                                    items={attrs[attrID].values.split(';').map((item) => item.trim()).filter((item) => item !== '')}
                                />
                            );
                        }
                        break;
                    case 'multiselect':
                        {
                            let val = [];
                            if (typeof selectedObject.attrs[attrID] === 'string') {
                                val = selectedObject.attrs[attrID].split(';').map((item) => item.trim());
                            } else {
                                val = selectedObject.attrs[attrID];
                            }
                            val = val.filter((item) => item !== '');

                            content = (
                                <MultipleSelect
                                    multiple
                                    value={val}
                                    onChange={(e) => { this.onChangeAttr(e, 'multiselect', attrID); }}
                                    items={attrs[attrID].values.split(';').map((item) => item.trim()).filter((item) => item !== '')}
                                />
                            );
                        }
                        break;
                    case 'text':
                        content = (
                            <AttributeInput
                                value={selectedObject.attrs[attrID].toString()}
                                onChange={(e) => { this.onChangeAttr(e, 'text', attrID); }}
                            />
                        );
                        break;
                    case 'number':
                        {
                            // TODO parse without min max step
                            const numberSpec = attrs[attrID].values.split(';');
                            content = (
                                <AttributeInput
                                    value={selectedObject.attrs[attrID]}
                                    onChange={(e) => { this.onChangeAttr(e, 'number', attrID); }}
                                    params={{
                                        type: 'number', min: numberSpec[0], max: numberSpec[1], step: numberSpec[2],
                                    }}
                                />
                            );
                        }
                        break;
                    default:
                        break;
                }

                if (content) {
                    const tmpContent = (
                        <tr>
                            <td style={{ width: '90px' }}>
                                <div
                                    title={attrs[attrID].name}
                                    style={{
                                        width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                    }}
                                >
                                    {attrs[attrID].name}
                                </div>
                            </td>
                            <td>
                                {content}
                            </td>
                        </tr>
                    );
                    tmp = [...tmp, tmpContent];
                }
            });
        }

        if (selectedObject.id > -1) {
            panelContent = (
                <div className="container p-0">
                    {/* style={{ overflowX: 'scroll' }} */}
                    <div className="row">
                        <div className="col-auto">
                            Label:
                        </div>
                        <div className="col-auto">
                            <MultipleSelect
                                items={labelItems}
                                value={[labels[selectedObject.label].name]}
                                onChange={this.onChangeLabel}
                            />
                        </div>
                    </div>
                    <hr className="m-1" style={{ marginTop: '1rem', marginBottom: '0px' }} />

                    <table className="table table-sm table-borderless m-0">
                        <thead>
                            {/* <tr>
                                <th scope="col" style={{ width: '90px' }}>
                                    <div style={{
                                        width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                    }}
                                    >
                                        name
                                    </div>
                                </th>
                                <th scope="col">value</th>
                            </tr> */}
                        </thead>
                        <tbody>
                            {tmp}
                            {/* <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        roatationSom sacle
                                    </div>
                                </td>
                                <td>
                                    <MultipleSelect multiple />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        roatationSom sacle
                                    </div>
                                </td>
                                <td>
                                    <MultipleSelect />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        dispake any
                                    </div>
                                </td>
                                <td><AttributeInput /></td>
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        number
                                    </div>
                                </td>
                                <td><AttributeInput params={{ type: 'number' }} /></td>
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        A
                                    </div>
                                </td>
                                <td>
                                    <AttributeInput params={{ type: 'number', min: '-5' }} />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        B
                                    </div>
                                </td>
                                <td>
                                    <AttributeInput params={{
                                        type: 'number', min: '-5', max: '10', step: '0.1',
                                    }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        C
                                    </div>
                                </td>
                                <td>
                                    <Checkbox
                                        className="p-0"
                                        checked={testCheck}
                                        onChange={this.handleChange}
                                        size="small"
                                        value="small"
                                    />
                                </td>
                            </tr> */}
                            {/* start att panel content */}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <Card.Body className="p-2">
                {panelContent}
            </Card.Body>
        );
    }
}

AttributesPanel.propTypes = {
    selectedObject: PropTypes.object,
    labels: PropTypes.object,
    changeLabel: PropTypes.func,
    changeAttr: PropTypes.func,
    // getBatchs: PropTypes.func.isRequired,
    // deleteBatch: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
    selectedObject: state.annotations.selectedObject,
    labels: state.annotations.labels,
});

export default connect(mapStateToProps, { changeLabel, changeAttr })(AttributesPanel);
