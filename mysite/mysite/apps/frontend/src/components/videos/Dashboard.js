import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import { Button } from 'react-bootstrap';
import Videos from './Videos';
import Form from './Form';
import Uploader from './Uploader';

import ProjectSelect from '../myselect/ProjectSelect';
import PackSelect from '../myselect/PackSelect';


export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProject: { id: null, name: null },
            currentPack: { id: null, name: null },
            projectPacks: [],
            videos: [],
            show: false,
        };
    }

    async getVideosByProject(id) {
        const res = await axios.get(`/api/v1/videos/?project=${id}`);
        this.setState({ videos: res.data });
    }

    async getVideosByPack(id) {
        const res = await axios.get(`/api/v1/videos/?pack=${id}`);
        this.setState({ videos: res.data });
    }

    handleProjectChange = (project, packs) => {
        console.log('selectProject, projectPacks', project, packs);
        const { currentProject, projectPacks, currentPack } = this.state;
        this.setState({
            currentProject: project,
            projectPacks: packs,
            currentPack: { id: null, name: null },
        }, () => {
            console.log('handleProjectChange set', currentProject, projectPacks, currentPack);
        });
    }

    handlePackChange = (childData) => {
        const { currentPack } = this.state;
        this.setState({ currentPack: childData }, () => { console.log('handlePackChange set', childData, currentPack); });
    }

    handleDeleteVideo = (videoID) => {
        const { videos } = this.state;
        this.setState({ videos: videos.filter((item) => item.id !== videoID) },
            () => {
                console.log('videos', videos);
            });
    }

    handleClose = () => { this.setState({ show: false }); }

    handleShow = () => { this.setState({ show: true }); }

    handleSearch = () => {
        const { currentProject, currentPack } = this.state;
        console.log('handleSearch', currentProject, currentPack);

        if (currentProject.id !== null) {
            if (currentPack.id === null) {
                // getProjectVideos(currentProject.id);
                this.getVideosByProject(currentProject.id);
            } else {
                // getPackVideos(currentPack.id);
                this.getVideosByPack(currentPack.id);
            }
        }
    }

    render() {
        const {
            currentProject, projectPacks, videos, show,
        } = this.state;
        let flag = true;
        if (typeof (currentProject.id) === 'number') {
            flag = false;
        }

        return (
            <div className="container">
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
                            projectPacks={projectPacks}
                            onPackChange={this.handlePackChange}
                        />
                    </div>
                    <div className="col p-0">
                        <Button variant="primary" onClick={this.handleSearch} disabled={flag}>
                            Search
                            {/* #TODO: create api get project's pack's videos */}
                        </Button>
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col p-0">
                        <Videos
                            videos={videos}
                            onDeleteVideo={this.handleDeleteVideo}
                        />
                        {/* #TODO add callback delete, use loacl state */}
                    </div>
                </div>


                {/* <Form /> */}
                {/* file uploader for json assign task */}


            </div>
        );
    }
}


export default connect(null, {})(Dashboard);
