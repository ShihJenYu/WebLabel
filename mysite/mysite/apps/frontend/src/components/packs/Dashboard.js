import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import Packs from './Packs';
import Form from './Form';
import ProjectSelect from '../myselect/MySelect';

import { Button } from 'react-bootstrap';


export class Dashboard extends Component {

    state = {
        current_project: null,
        show: false
    }

    callbackFunction = (childData) => {
        this.setState({ current_project: childData }, () => { console.log('current_project', childData, this.state.current_project) })

    }

    handleClose = () => { this.setState({ show: false }); }
    handleShow = () => { this.setState({ show: true }); }


    render() {
        const { current_project, show } = this.state;
        let flag = (current_project == null) ? true : false;

        console.log('re-render in dashboard');
        return (
            <Fragment>
                <ProjectSelect parentCallback={this.callbackFunction} />
                <br></br>
                <Button variant="primary" onClick={this.handleShow} disabled={flag} >
                    Creat Pack
                </Button>
                <Form show={show} parentCallHide={this.handleClose} project={current_project} />
                <Packs />

            </Fragment>
        )
    }
}

export default connect(null, {})(Dashboard);
