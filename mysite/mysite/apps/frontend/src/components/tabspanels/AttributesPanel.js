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

export class TabsPanels extends Component {
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

    render() {
        const {
            testCheck,
        } = this.state;

        return (
            <Card.Body className="p-2">
                <div className="container p-0">
                    {/* style={{ overflowX: 'scroll' }} */}
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
                            {/* start att panel content */}
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
                                        number input any
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
                                        InputProps any
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
                                        InputProps any
                                    </div>
                                </td>
                                <td>
                                    <AttributeInput params={{ type: 'number', min: '-5', max: '10', step: '0.1' }} />
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
                                        InputProps any
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
                            </tr>
                            <tr>
                                <td style={{ width: '90px' }}>
                                    <div
                                        title="roatationSom sacle"
                                        style={{
                                            width: '90px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        InputProps any
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
                            </tr>
                            {/* start att panel content */}
                        </tbody>
                    </table>
                </div>

            </Card.Body>
        );
    }
}

TabsPanels.propTypes = {

    // getBatchs: PropTypes.func.isRequired,
    // deleteBatch: PropTypes.func.isRequired,
};

export default connect(null, {})(TabsPanels);
