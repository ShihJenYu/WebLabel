import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Projects from './Projects';
import Form from './Form';
import Editor from './Editor';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            project_id: null,
            project_name: null,
            project_users: { in: [], all: [] },
            labels: [],
        };
    }

    async getUsers(show, id, name) {
        if (id) {
            const res = await axios.get(`/api/v1/projects/${id}/users`);
            const res2 = await axios.get(`/api/v1/labels/?project=${id}`);
            console.log('res', res);
            console.log('res2', res2);
            this.setState({
                edit: show,
                project_id: id,
                project_name: name,
                project_users: res.data,
                labels: res2.data,
            });
        }
    }

    handleShowEdit = (show, id, name) => {
        console.log('currentProject', show, id, name);
        this.getUsers(show, id, name);
    }

    handleCloseEdit = () => {
        console.log('handleCloseEdit');
        this.setState({
            edit: false,
            project_id: null,
            project_name: null,
            project_users: { in: [], all: [] },
        });
    }

    render() {
        const {
            edit, project_id, project_name, project_users, labels,
        } = this.state;

        console.log('labels', labels);

        return (
            <>
                <div className="container">
                    <br />
                    <div className="row">
                        <Form />
                    </div>
                    <div className="row">
                        <Projects onShowEdit={this.handleShowEdit} />
                    </div>
                    <div className="row">
                        <div className="container">
                            <Editor
                                show={edit}
                                project_id={project_id}
                                project_name={project_name}
                                project_users={project_users}
                                labels={labels}
                                parentCallHide={this.handleCloseEdit}
                            />
                        </div>
                    </div>

                </div>
            </>
        );
    }
}

export default connect(null, {})(Dashboard);
