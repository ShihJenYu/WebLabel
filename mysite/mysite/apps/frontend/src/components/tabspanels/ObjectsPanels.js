import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Accordion, Card,
} from 'react-bootstrap';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import AttributesPanel from './AttributesPanel';

import { selectObject, deleteObject } from '../../actions/annotations';


export class TabsPanels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aClose: false, bClose: false, cClose: false,
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        console.log('didupdate', this.accordionAll.children[0].clientHeight);
    }

    // 34px is right tab height, 25px is Accordion.Toggle height
    // 'calc(100vh - 34px)'
    // 'calc(100vh - 301px)'  301 is tmp sample 267(include 3*(25+64))+34

    // TODO need re calc

    handleCalc = (tag) => {
        console.log('handleCalc', tag);
        const { aClose, bClose, cClose } = this.state;
        let naClose = aClose;
        let nbClose = bClose;
        let ncClose = cClose;
        if (tag === 'aClose') {
            naClose = !aClose;
        } else if (tag === 'bClose') {
            nbClose = !bClose;
        } else if (tag === 'cClose') {
            ncClose = !cClose;
        }

        this.setState({
            aClose: naClose,
            bClose: nbClose,
            cClose: ncClose,
        });
    }

    handleButtonClick = (e, id) => {
        e.stopPropagation();
        console.log('click', id);
    }

    handleButtonClick2 = (e, id) => {
        e.stopPropagation();
        console.log('click2', id);
    }

    handleButtonClick3 = (e, id) => {
        const { deleteObject } = this.props;
        e.stopPropagation();
        console.log('click3', id);
        // TODO need to delete obj on local
        deleteObject(id);
    }

    handleButtonClick4 = (e, id) => {
        const { selectObject } = this.props;
        e.stopPropagation();
        console.log('click4', id);
        selectObject(id);
    }

    handleButtonClick5 = (e, id) => {
        console.log('click5', id);
    }

    handleButtonClick6 = () => {
        console.log('click6');
    }


    render() {
        const {
            allHeight,
            aClose,
            bClose,
            cClose,
        } = this.state;
        const { annotations, labels, accordion1BodyH } = this.props;
        let objects = '';
        if (annotations) {
            objects = annotations.map((annotatation) => (
                <div
                    key={annotatation.id}
                    className="card"
                    style={{ marginBottom: '1px' }}
                    onClick={(e) => {
                        this.handleButtonClick(e, annotatation.id);
                    }}
                >
                    <div
                        className="card-header p-0"
                        onClick={(e) => {
                            this.handleButtonClick2(e, annotatation.id);
                        }}
                    >
                        {`${annotatation.id} ${annotatation.shapetype}`}
                        <IconButton
                            className="float-right p-0"
                            aria-label="delete"
                            onClick={(e) => {
                                this.handleButtonClick3(e, annotatation.id);
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div
                        className="card-body p-1"
                        onClick={(e) => {
                            this.handleButtonClick4(e, annotatation.id);
                        }}
                    >
                        <h5 className="card-title p-1 m-0">{labels[annotatation.label].name}</h5>
                    </div>
                </div>
            ));
        }

        console.log('in render show allHeight', allHeight);
        let hh = 157;
        let hhstr = '100vh';
        if (this.accordionAll) {
            console.log('in render', this.accordionAll.children[0].clientHeight);
            hh = 25 * 3 + 34;

            hh += (aClose) ? 0 : accordion1BodyH;
            hh += (bClose) ? 0 : 16;
            hh += (cClose) ? 0 : 16;
            hhstr = `calc(100vh - ${hh}px)`;
        }

        return (
            <div className="container pt-0" style={{ background: 'antiquewhite' }}>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                        maxHeight: hhstr,
                        minHeight: hhstr, // allHeightStr,
                    }}
                >
                    <div className="col" style={{ padding: '2px' }}>
                        {/* start a object component */}
                        {objects}
                        {/* end a object component */}
                    </div>
                </div>
                <div className="row" ref={(cell) => { this.accordionAll = cell; }}>
                    <div className="container p-0" style={{ background: 'black', position: 'absolute', bottom: '0' }}>
                        {/* start a tool panel component */}
                        <Accordion defaultActiveKey="0" ref={(cell) => { this.accordion1 = cell; }}>
                            <Card>
                                <Accordion.Toggle onClick={() => { this.handleCalc('aClose'); }} className="py-0" as={Card.Header} eventKey="0">
                                    Click A!
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <AttributesPanel />
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        {/* end a tool panel component */}

                        <Accordion defaultActiveKey="0" ref={(cell) => { this.accordion2 = cell; }}>
                            <Card>
                                <Accordion.Toggle onClick={() => { this.handleCalc('bClose'); }} className="py-0" as={Card.Header} eventKey="0">
                                    Click B!
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body className="p-2"></Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>

                        <Accordion defaultActiveKey="0" ref={(cell) => { this.accordion3 = cell; }}>
                            <Card>
                                <Accordion.Toggle onClick={() => { this.handleCalc('cClose'); }} className="py-0" as={Card.Header} eventKey="0">
                                    Click C!
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body className="p-2"></Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </div>
                </div>
            </div>
        );
    }
}

TabsPanels.propTypes = {
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    selectObject: PropTypes.func.isRequired,
    deleteObject: PropTypes.func.isRequired,
    accordion1BodyH: PropTypes.any,
    labels: PropTypes.object,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    labels: state.annotations.labels,
    accordion1BodyH: state.annotations.accordion1BodyH,
});

export default connect(mapStateToProps, { selectObject, deleteObject })(TabsPanels);
