import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getProjects } from '../../actions/projects';


export class ProjectSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { currentProject: null };
    }

    componentDidMount() {
        const { getProjects } = this.props;
        getProjects();
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in ProjectSelect');
        console.log(this.state);
    }

    async getPacks(project) {
        const { onProjectChange } = this.props;
        const res = await axios.get(`/api/v1/projects/${project.id}/packs`);

        console.log('res.data', res.data);
        onProjectChange(project, res.data);
    }

    sendData = () => {
        const { currentProject } = this.state;
        console.log('sendData', currentProject);
        this.getPacks(currentProject);
    }

    onChange = (e) => {
        this.setState({
            currentProject: {
                id: +e.target.value,
                name: e.target.selectedOptions[0].text,
            },
        },
        () => { this.sendData(); });
    }

    render() {
        const { currentProject } = this.state;
        const { projects } = this.props;
        const projectname = (currentProject == null) ? '' : currentProject.name;
        console.log('projectname', projectname);
        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                            Project:
                    </span>
                </div>
                <select defaultValue="DEFAULT" className="form-control" id="projectSelect" name="project" onChange={this.onChange}>
                    <option disabled value="DEFAULT"> -- select an option -- </option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>
        );
    }
}

ProjectSelect.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    getProjects: PropTypes.func.isRequired,
    onProjectChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    // state.reducer.initialState's content
    projects: state.projects.projects,
});

export default connect(mapStateToProps, { getProjects })(ProjectSelect);
