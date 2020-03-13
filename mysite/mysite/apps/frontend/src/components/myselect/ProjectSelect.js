import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getProjects } from '../../actions/projects';

import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

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
    }

    async getPacks(project) {
        const { onProjectChange } = this.props;
        const res = await axios.get(`/api/v1/projects/${project.id}/packs`);

        onProjectChange(project, res.data);
    }

    sendData = () => {
        const { currentProject } = this.state;
        this.getPacks(currentProject);
    }

    onChange = (e) => {
        this.setState({
            currentProject: {
                id: +e.target.value,
                name: e.target.selectedOptions[0].text,
            },
        }, () => { this.sendData(); });
    }

    resetSelected = () => {
        const { onProjectChange } = this.props;
        this.setState({ currentProject: null });
        onProjectChange({ id: null, name: null }, []);
    }

    render() {
        const { currentProject } = this.state;
        const { projects } = this.props;
        const selectedValue = (currentProject == null) ? 'DEFAULT' : currentProject.id;
        console.log('project id', selectedValue);
        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Project:
                    </span>
                </div>
                <select className="form-control" id="projectSelect" name="project" value={selectedValue} onChange={this.onChange}>
                    <option disabled value="DEFAULT"> -- select an option -- </option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
                <div className="input-group-append">
                    <span className="input-group-text">
                        <IconButton
                            aria-label="reset"
                            size="medium"
                            style={{ margin: 0, padding: 0 }}
                            onClick={this.resetSelected}
                        >
                            <RefreshIcon fontSize="default" />
                        </IconButton>
                    </span>
                </div>
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
    projects: state.projects.projects,
});

export default connect(mapStateToProps, { getProjects })(ProjectSelect);
