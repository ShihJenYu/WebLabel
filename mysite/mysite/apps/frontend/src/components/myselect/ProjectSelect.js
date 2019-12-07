import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProjects, getProjectPacks } from '../../actions/projects';

export class ProjectSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { current_project: null };
    }

    componentDidMount() {
        const { getProjects } = this.props;
        getProjects();
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in MySelect');
        console.log(this.state);
    }

    sendData = () => {
        // getProjectPacks ,
        const { getProjectPacks, onProjectChange } = this.props;
        const { current_project } = this.state;
        getProjectPacks(current_project.id);
        console.log('sendData', current_project);
        onProjectChange(current_project);
    }

    onChange = (e) => {
        this.setState({
            current_project: {
                id: e.target.value,
                name: e.target.selectedOptions[0].text,
            },
        },
        () => { this.sendData(); });
    }

    render() {
        const { current_project } = this.state;
        const { projects } = this.props;
        const projectname = (current_project == null) ? '' : current_project.name;
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
    getProjectPacks: PropTypes.func.isRequired,
    onProjectChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    // state.reducer.initialState's content
    projects: state.projects.projects,
});

export default connect(mapStateToProps, { getProjects, getProjectPacks })(ProjectSelect);
