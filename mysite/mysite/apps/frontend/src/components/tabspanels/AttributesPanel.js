import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import { Card } from 'react-bootstrap';

import Checkbox from '@material-ui/core/Checkbox';

import MultipleSelect from '../myselect/MultipleSelect';
import AttributeInput from '../myselect/AttributeInput';

import { changeLabel, changeAttr, setAccordion1BodyH } from '../../actions/annotations';

export class AttributesPanel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        const { accordion1BodyH, setAccordion1BodyH } = this.props;
        // console.log('didupdate,', this);
        this.divElement.parentElement.style.display = 'block';
        if (this.divElement.clientHeight !== accordion1BodyH) {
            setAccordion1BodyH(this.divElement.clientHeight);
        }
        this.divElement.parentElement.style.display = '';
    }

    // 34px is right tab height, 25px is Accordion.Toggle height
    // 'calc(100vh - 34px)'
    // 'calc(100vh - 301px)'  301 is tmp sample 267(include 3*(25+64))+34

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
        const { labels, selectedObject } = this.props;
        // console.log('labels, selectedObject', labels, selectedObject);
        // TODO selectedObject will change by object panel

        // selectedObject decied content attribute

        let panelContent = null;

        const labelItems = Object.values(labels).map((item) => item.name);
        let tmp = [];
        const selectedObjectID = (selectedObject.id) ? +(selectedObject.id.toString().replace('new_', '')) : -1;
        if (selectedObjectID > -1 && selectedObject.label > -1) {
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
                                    key={attrID}
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
                                    key={attrID}
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
                                    key={attrID}
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
                                key={attrID}
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
                                    key={attrID}
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
                        <tr key={attrID}>
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

        if (selectedObjectID > -1) {
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
                        <tbody>
                            {tmp}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <Card.Body className="p-2" ref={(divElement) => { this.divElement = divElement; }}>
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
    accordion1BodyH: PropTypes.any,
    setAccordion1BodyH: PropTypes.func.isRequired,
    // deleteBatch: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
    selectedObject: state.annotations.selectedObject,
    labels: state.annotations.labels,
    accordion1BodyH: state.annotations.accordion1BodyH,
});

export default connect(
    mapStateToProps,
    {
        changeLabel, changeAttr, setAccordion1BodyH,
    },
)(AttributesPanel);
