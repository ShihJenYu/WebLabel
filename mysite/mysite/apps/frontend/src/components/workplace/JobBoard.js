import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

export class JobBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // currentProject: { id: null, name: null },
            // projectPacks: [],
            // show: false,
        };
    }

    // handleProjectChange = (project, packs) => {
    //     console.log('selectProject, projectPacks', project, packs);
    //     const { currentProject, projectPacks } = this.state;
    //     this.setState({ currentProject: project, projectPacks: packs },
    //         () => {
    //             console.log('currentProject', currentProject, projectPacks);
    //         });
    // }

    // handleAddPack = (pack) => {
    //     console.log('addedPack', pack);
    //     const { currentProject, projectPacks } = this.state;
    //     this.setState({ projectPacks: [...projectPacks, pack] },
    //         () => {
    //             console.log('currentProject', currentProject, projectPacks);
    //         });
    // }

    // handleDeletePack = (packID) => {
    //     const { currentProject, projectPacks } = this.state;
    //     this.setState({ projectPacks: projectPacks.filter((item) => item.id !== packID) },
    //         () => {
    //             console.log('currentProject', currentProject, projectPacks);
    //         });
    // }

    // handleRenamePack = (packID, pack) => {
    //     const { currentProject, projectPacks } = this.state;
    //     this.setState({
    //         projectPacks: projectPacks.map((item) => {
    //             if (item.id === packID) { return pack; } return item;
    //         }),
    //     },
    //     () => {
    //         console.log('currentProject', currentProject, projectPacks);
    //     });
    // }


    // handleClose = () => { this.setState({ show: false }); }

    // handleShow = () => { this.setState({ show: true }); }

    render() {
        // const { currentProject, projectPacks, show } = this.state;
        // let flag = true;
        // let projectID = -1;
        // if (typeof (currentProject.id) === 'number') {
        //     flag = false; projectID = currentProject.id;
        // }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <h1>Job Board</h1>
                    </div>
                </div>
                <div className="row justify-content-start">
                    <div className="col-3">
                        <Button block variant="outline-info">Get</Button>
                    </div>
                    <div className="col-3">
                        <Button block variant="outline-info">Send</Button>
                    </div>
                </div>
                <div className="row">
                    <h1>Job Board</h1>
                </div>
            </div>
        );
    }
}

export default connect(null, {})(JobBoard);
