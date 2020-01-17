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
            currentProject: { id: null, name: null },
            projectPacks: [],
            show: false,
        };
    }

    handleProjectChange = (project, packs) => {
        console.log('selectProject, projectPacks', project, packs);
        const { currentProject, projectPacks } = this.state;
        this.setState({ currentProject: project, projectPacks: packs },
            () => {
                console.log('currentProject', currentProject, projectPacks);
            });
    }

    handleAddPack = (pack) => {
        console.log('addedPack', pack);
        const { currentProject, projectPacks } = this.state;
        this.setState({ projectPacks: [...projectPacks, pack] },
            () => {
                console.log('currentProject', currentProject, projectPacks);
            });
    }

    handleDeletePack = (packID) => {
        const { currentProject, projectPacks } = this.state;
        this.setState({ projectPacks: projectPacks.filter((item) => item.id !== packID) },
            () => {
                console.log('currentProject', currentProject, projectPacks);
            });
    }

    handleRenamePack = (packID, pack) => {
        const { currentProject, projectPacks } = this.state;
        this.setState(
            {
                projectPacks: projectPacks.map((item) => {
                    if (item.id === packID) { return pack; } return item;
                }),
            }, () => { console.log('currentProject', currentProject, projectPacks); },
        );
    }


    handleClose = () => { this.setState({ show: false }); }

    handleShow = () => { this.setState({ show: true }); }

    render() {
        const { currentProject, projectPacks, show } = this.state;
        let flag = true;
        let projectID = -1;
        if (typeof (currentProject.id) === 'number') {
            flag = false; projectID = currentProject.id;
        }

        return (
            <div className="container-full">
                <div className="row m-2">
                    <div className="col p-0">
                        <ProjectSelect onProjectChange={this.handleProjectChange} />
                    </div>
                </div>
                <div className="row m-2">
                    <Button variant="primary" onClick={this.handleShow} disabled={flag}>
                        Creat Pack
                    </Button>
                    <Form
                        show={show}
                        parentCallHide={this.handleClose}
                        projectID={projectID}
                        onAddPack={this.handleAddPack}
                    />
                </div>
                <div className="row m-2">
                    <Packs
                        projectPacks={projectPacks}
                        onRenamePack={this.handleRenamePack}
                        onDeletePack={this.handleDeletePack}
                    />
                </div>
            </div>
        );
    }
}

export default connect(null, {})(Dashboard);
