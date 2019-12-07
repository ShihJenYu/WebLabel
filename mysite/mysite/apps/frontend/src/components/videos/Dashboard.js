import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import Videos from './Videos';
import Form from './Form';
import Uploader from './Uploader';

import ProjectSelect from '../myselect/ProjectSelect';
import PackSelect from '../myselect/PackSelect';

import { getPackVideos, getProjectVideos } from '../../actions/videos';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_project: { id: 'null', name: 'null' },
            current_pack: { id: 'null', name: 'null' },
            show: false,
        };
    }

    handleProjectChange = (childData) => {
        const { current_project } = this.state;
        this.setState({ current_project: childData }, () => { console.log('current_project', childData, current_project); });
    }

    handlePackChange = (childData) => {
        const { current_pack } = this.state;
        this.setState({ current_pack: childData }, () => { console.log('current_pack', childData, current_pack); });
    }

    handleClose = () => { this.setState({ show: false }); }

    handleShow = () => { this.setState({ show: true }); }

    handleSearch = () => {
        const { current_project, current_pack } = this.state;
        const { getProjectVideos, getPackVideos } = this.props;
        console.log(current_project, current_pack);

        if (current_project.id !== 'null' && current_project.id !== null) {
            if (current_pack.id !== 'null' && current_pack.id !== null) {
                getPackVideos(current_project.id);
            } else {
                getProjectVideos(current_project.id);
            }
        }
    }

    render() {
        const { show, current_project, current_pack } = this.state;
        const projectIsSelected = (current_project.id === null);
        const packIsSelected = (current_pack.id === null);
        return (
            <>
                <div className="row p-3">
                    <Button variant="primary" onClick={this.handleShow}>
                    Open Create Videos Modal
                    </Button>
                    <Form
                        show={show}
                        parentCallHide={this.handleClose}
                    />
                </div>
                <div className="row p-3">
                    <Uploader />
                </div>
                <div className="row p-3">
                    <div className="col p-0">
                        <ProjectSelect onProjectChange={this.handleProjectChange} />
                    </div>
                    <div className="col p-0">
                        <PackSelect
                            project={current_project.id}
                            onPackChange={this.handlePackChange}
                        />
                    </div>
                    <div className="col p-0">
                        <Button variant="primary" onClick={this.handleSearch} disabled={projectIsSelected}>
                            Search
                            {/* #TODO: create api get project's pack's videos */}
                        </Button>
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col p-0">
                        <Videos />
                    </div>
                </div>


                {/* <Form /> */}
                {/* file uploader for json assign task */}


            </>
        );
    }
}

Dashboard.propTypes = {
    getProjectVideos: PropTypes.func.isRequired,
    getPackVideos: PropTypes.func.isRequired,
};

export default connect(null, { getPackVideos, getProjectVideos })(Dashboard);
