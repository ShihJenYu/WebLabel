import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';


import {
    Tab, Col, Row, Nav,
} from 'react-bootstrap';


import ObjectsPanels from './ObjectsPanels';

export class TabsPanels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'objects',
        };
    }

    handleSelect = (selectedTab) => {
        console.log('handleSelect');
        this.setState({
            activeTab: selectedTab,
        });
    }

    render() {
        const { activeTab } = this.state;

        return (
            <Tab.Container id="left-tabs-example" onSelect={this.handleSelect} activeKey={activeTab}>
                <Row>
                    <Col className="p-0">
                        <Nav variant="tabs" className="nav-justified">
                            <Nav.Item>
                                <Nav.Link className="py-1" eventKey="objects">Objects</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="py-1" eventKey="labels">Labels</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="py-1" eventKey="groups">Groups</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row className="" style={{ height: 'calc(100vh - 34px)' }}>
                    <Col className="p-0">
                        <Tab.Content className="">
                            <Tab.Pane eventKey="objects" className="">
                                <ObjectsPanels />
                            </Tab.Pane>
                            <Tab.Pane eventKey="labels">
                                yaya
                            </Tab.Pane>
                            <Tab.Pane eventKey="groups">
                                sasa
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

TabsPanels.propTypes = {

    // getBatchs: PropTypes.func.isRequired,
    // deleteBatch: PropTypes.func.isRequired,
};

export default connect(null, {})(TabsPanels);
