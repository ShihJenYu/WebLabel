import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProjects, getProjectPacks } from '../../actions/projects';

export class MySelect extends Component {

    sendData = () => {
        this.props.getProjectPacks(this.state.current_project.id);
        console.log("sendData", this.state.current_project);
        this.props.parentCallback(this.state.current_project);
    }

    state = {
        current_project: null
    }

    static propTypes = {
        projects: PropTypes.array.isRequired,
        getProjects: PropTypes.func.isRequired,
        getProjectPacks: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getProjects();
    }

    componentDidUpdate() {
        console.log("componentDidUpdate in MySelect");
        console.log(this.state)
    }


    onChange = e => {
        this.setState({ current_project: { id: e.target.value, name: e.target.selectedOptions[0].text } },
            () => { this.sendData(); })
    }

    render() {
        const { current_project } = this.state;
        let projectname = (current_project == null) ? '' : current_project.name;
        console.log('projectname', projectname)
        return (
            <div>

                <label htmlFor="projectSelect">Project: {projectname}</label>
                <select defaultValue={'DEFAULT'} className="form-control" id="projectSelect" name="project" onChange={this.onChange}>
                    <option disabled value="DEFAULT" > -- select an option -- </option>
                    {this.props.projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    // state.reducer.initialState's content
    projects: state.projects.projects,
})

export default connect(mapStateToProps, { getProjects, getProjectPacks })(MySelect);
