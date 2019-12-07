import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Packs from './Packs';
import Form from './Form';
import ProjectSelect from '../myselect/ProjectSelect';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_project: { id: 'null', name: 'null' },
            show: false,
        };
    }

    callbackFunction = (childData) => {
        const { current_project } = this.state;
        this.setState({ current_project: childData }, () => { console.log('current_project', childData, current_project); });
    }

    handleClose = () => { this.setState({ show: false }); }

    handleShow = () => { this.setState({ show: true }); }

    render() {
        const { current_project, show } = this.state;
        const flag = (current_project.id === 'null');

        console.log('re-render in dashboard');
        return (
            <>
                <ProjectSelect parentCallback={this.callbackFunction} />
                <br />
                <Button variant="primary" onClick={this.handleShow} disabled={flag}>
                    Creat Pack
                </Button>
                <Form show={show} parentCallHide={this.handleClose} project={current_project.id} />
                <Packs />
            </>
        );
    }
}

export default connect(null, {})(Dashboard);
