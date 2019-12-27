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
            project_users: { in: [], out: [] },
        };
    }

    async getUsers(show, id, name) {
        if (id) {
            const res = await axios.get(`/api/v1/projects/${id}/users`);
            console.log('res', res);
            this.setState({
                edit: show,
                project_id: id,
                project_name: name,
                project_users: res.data,
            });
        }
    }

    handleShowEdit = (show, id, name) => {
        console.log('currentProject', show, id, name);
        this.getUsers(show, id, name);
    }


    render() {
        const {
            edit, project_id, project_name, project_users,
        } = this.state;

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
                        <Editor
                            show={edit}
                            project_id={project_id}
                            project_name={project_name}
                            project_users={project_users}
                        />
                    </div>

                </div>
            </>
        );
    }
}

export default connect(null, {})(Dashboard);
