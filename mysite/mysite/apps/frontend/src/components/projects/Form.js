import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button, Modal } from 'react-bootstrap';
import { addProject } from '../../actions/projects';

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            show: false,
        };
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in video form');
        console.log(this.state);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log('submit add project');
        console.log(this.state);
        const { name } = this.state;
        const { addProject } = this.props;
        const project = { name };
        addProject(project);
    }

    handleClose = () => { this.setState({ show: false }); }

    handleShow = () => { this.setState({ show: true }); }

    render() {
        const { name, show } = this.state;
        return (
            <div>
                <Button variant="primary" onClick={this.handleShow}>
                    Creat Project
                </Button>
                <Modal show={show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Project Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="projectname">Project Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="projectname"
                                    aria-describedby="projectnameHelp"
                                    placeholder="Enter new project name"
                                    name="name"
                                    value={name}
                                    onChange={this.onChange}
                                />
                                <small id="projectnameHelp" className="form-text text-muted">Dont create existed project</small>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

Form.propTypes = {
    addProject: PropTypes.func.isRequired,
};

export default connect(null, { addProject })(Form);
