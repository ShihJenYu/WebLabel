import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';


import {
    Accordion, Card,
} from 'react-bootstrap';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import AttributesPanel from './AttributesPanel';

import { getAnnotations } from '../../actions/annotations';


export class TabsPanels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHeight: 301, allHeightStr: 'calc(100vh - 301px)', aClose: false, bClose: false, cClose: false,
        };
    }

    componentDidMount() {
        const { getAnnotations } = this.props;
        getAnnotations();
    }

    // 34px is right tab height, 25px is Accordion.Toggle height
    // 'calc(100vh - 34px)'
    // 'calc(100vh - 301px)'  301 is tmp sample 267(include 3*(25+64))+34

    handleCalc = (tag) => {
        console.log('handleCalc');
        const { aClose, bClose, cClose } = this.state;
        const minH = 25 * 3 + 34;
        let naClose = aClose;
        let nbClose = bClose;
        let ncClose = cClose;
        let contentH = minH;
        if (tag === 'aClose') {
            naClose = !aClose;
        } else if (tag === 'bClose') {
            nbClose = !bClose;
        } else if (tag === 'cClose') {
            ncClose = !cClose;
        }

        contentH += (naClose) ? 0 : 64;
        contentH += (nbClose) ? 0 : 64;
        contentH += (ncClose) ? 0 : 64;

        // console.log(a, b, c);
        // const total = a + b + c;

        this.setState({
            allHeight: contentH,
            allHeightStr: `calc(100vh - ${contentH}px)`,
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
        e.stopPropagation();
        console.log('click3', id);
    }

    handleButtonClick4 = (e, id) => {
        e.stopPropagation();
        console.log('click4', id);
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
            allHeightStr,
            aClose,
            bClose,
            cClose,
        } = this.state;
        const { annotations } = this.props;
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
                        className="card-header p-0" onClick={(e) => {
                            this.handleButtonClick2(e, annotatation.id);
                        }}
                    >
                        {annotatation.type}
                        <IconButton className="float-right p-0" aria-label="delete" onClick={(e) => {
                            this.handleButtonClick3(e, annotatation.id);
                        }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="card-body p-1" onClick={(e) => {
                        this.handleButtonClick4(e, annotatation.id);
                    }}
                    >
                        <h5 className="card-title p-1 m-0">{annotatation.name}</h5>
                    </div>
                </div >
            ));
        }

        console.log('in render show allHeight', allHeight);
        return (
            <div className="container pt-0" style={{ background: 'antiquewhite' }}>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                        maxHeight: allHeightStr,
                        minHeight: allHeightStr,
                    }}
                >
                    <div className="col" style={{ padding: '2px' }}>
                        {/* start a object component */}
                        {objects}
                        {/* end a object component */}
                    </div>
                </div>
                <div className="row">
                    <div className="container p-0" style={{ background: 'black', position: 'absolute', bottom: '0' }}>
                        {/* start a tool panel component */}
                        <Accordion defaultActiveKey="0" ref={(cell) => { this.accordion1 = cell; }}>
                            <Card>
                                <Accordion.Toggle onClick={() => { this.handleCalc('aClose', aClose); }} className="py-0" as={Card.Header} eventKey="0">
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
                                <Accordion.Toggle onClick={() => { this.handleCalc('bClose', bClose); }} className="py-0" as={Card.Header} eventKey="0">
                                    Click B!
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the B body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>

                        <Accordion defaultActiveKey="0" ref={(cell) => { this.accordion3 = cell; }}>
                            <Card>
                                <Accordion.Toggle onClick={() => { this.handleCalc('cClose', cClose); }} className="py-0" as={Card.Header} eventKey="0">
                                    Click C!
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the C body</Card.Body>
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
    getAnnotations: PropTypes.func.isRequired,
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,

    // getBatchs: PropTypes.func.isRequired,
    // deleteBatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
});

export default connect(mapStateToProps, { getAnnotations })(TabsPanels);
