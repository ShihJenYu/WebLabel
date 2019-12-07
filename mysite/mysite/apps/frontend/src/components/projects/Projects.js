import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { getProjects, deleteProject, renameProject } from '../../actions/projects';


export class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project_id: null,
            project_name: null,
            show: false,
        };
    }

    componentDidMount() {
        const { getProjects } = this.props;
        getProjects();
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in Projects');
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
        const { project_id, project_name } = this.state;
        const { renameProject } = this.props;
        const project = { name: project_name };
        renameProject(project_id, project);
        this.handleClose();
    }

    handleClose = () => { this.setState({ show: false }); }

    handleShow = (id, name) => {
        this.setState({
            show: true,
            project_id: id,
            project_name: name,
        });
    }

    render() {
        const { show, project_name } = this.state;
        const { projects, deleteProject } = this.props;
        let tb = '';
        if (projects) {
            tb = projects.map((project) => (
                <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>
                        <button onClick={() => this.handleShow(project.id, project.name)} className="btn btn-info btn-sm">
                            Rename
                        </button>
                        <button onClick={deleteProject.bind(this, project.id)} className="btn btn-danger btn-sm">
                            Delete
                        </button>
                    </td>
                </tr>
            ));
        }
        return (
            <>
                <h2>Projects</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {tb}
                    </tbody>
                </table>
                <Modal show={show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Rename Modal</Modal.Title>
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
                                    name="project_name"
                                    value={project_name}
                                    onChange={this.onChange}
                                />
                                <small id="projectnameHelp" className="form-text text-muted">Dont create existed project</small>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

Projects.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    getProjects: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    renameProject: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    projects: state.projects.projects,
});

export default connect(mapStateToProps, { getProjects, deleteProject, renameProject })(Projects);
