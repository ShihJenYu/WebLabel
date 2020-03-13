import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Tasks from './Tasks';

import ProjectSelect from '../myselect/ProjectSelect';
import PackSelect from '../myselect/PackSelect';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProject: { id: null, name: null },
            currentPack: { id: null, name: null },
            projectPacks: [],
            update_list: '',
            tasks: [],
        };
    }

    handleProjectChange = (project, packs) => {
        console.log('selectProject, projectPacks', project, packs);
        const { currentProject, projectPacks, currentPack } = this.state;
        this.setState({
            currentProject: project,
            projectPacks: packs,
            currentPack: { id: null, name: null },
            tasks: [],
        }, () => {
            console.log('handleProjectChange set', currentProject, projectPacks, currentPack);
        });
    }

    handlePackChange = (childData) => {
        const { currentPack } = this.state;
        this.setState({ currentPack: childData, tasks: [] }, () => { console.log('handlePackChange set', childData, currentPack); });
    }

    update_list_change = (e) => {
        this.setState({ update_list: e.target.files[0] });
    }

    update_list_submit = (e) => {
        const { update_list } = this.state;
        console.log(update_list);
        this.upload_listfile(update_list);

        e.preventDefault();
    }

    upload_listfile = async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('action', 'batchlist');
        const res = await axios.post(`${window.location.origin}/api/v1/server/upload_listfile/`, data);
        console.log(res);
    }

    async showAllTasks() {
        const { currentProject, currentPack } = this.state;
        console.log('currentProject, currentPack', currentProject, currentPack);
        if (currentProject.id === null && currentPack.id === null) {
            this.setState({ tasks: [] });
        } else if (currentProject.id !== null && currentPack.id === null) {
            const res = await axios.get(`/api/v1/tasks/?project=${currentProject.id}`);
            this.setState({ tasks: res.data });
            console.log('select py project');
            console.log('tasks data', res);
        } else if (currentProject.id !== null && currentPack.id !== null) {
            const res = await axios.get(`/api/v1/tasks/?pack=${currentPack.id}`);
            this.setState({ tasks: res.data });
            console.log('select py pack');
            console.log('tasks data', res);
        }
    }

    render() {
        const {
            currentProject, projectPacks, tasks, update_list,
        } = this.state;

        return (
            <div className="container-fluid">
                <br />
                <div className="row align-items-center">
                    <div className="col-auto">
                        <form onSubmit={this.update_list_submit}>
                            <input type="file" name="file" onChange={this.update_list_change} accept=".csv" />
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-auto">
                        <div className="row align-items-center">
                            <ProjectSelect
                                onProjectChange={this.handleProjectChange}
                            />
                        </div>
                        <br />
                        <div className="row align-items-center">
                            <PackSelect
                                projectPacks={projectPacks}
                                onPackChange={this.handlePackChange}
                            />
                        </div>
                    </div>
                    <div className="col-7">
                        <Tasks
                            tasks={tasks}
                            // onDeleteVideo={this.handleDeleteVideo}
                            refreshTasks={() => this.showAllTasks()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {})(Dashboard);
