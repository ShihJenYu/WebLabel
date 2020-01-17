import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import JobBoard from './JobBoard';


export class WorkPlace extends Component {
    constructor(props) {
        super(props);
        this.state = { activeTab: 1 };
    }

    handleSelect = (selectedTab) => {
        console.log('handleSelect');
        this.setState({
            activeTab: selectedTab,
        });
    }

    render() {
        const { project } = this.props;
        const { activeTab } = this.state;

        return (
            <>
                <Tabs activeKey={activeTab} onSelect={this.handleSelect}>
                    <Tab eventKey={1} title={project.name.toUpperCase()}>Tab 1 content</Tab>
                    <Tab eventKey={2} title="Job"><JobBoard project={project} /></Tab>
                    <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
                    <Tab eventKey={4} title="Tab 4">Tab 4 content is displayed by default</Tab>
                    <Tab eventKey={5} title="Tab 5">Tab 5 content</Tab>
                </Tabs>
            </>
        );
    }
}

WorkPlace.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default connect(null, {})(WorkPlace);
