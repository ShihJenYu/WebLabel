import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addBatch } from '../../actions/batchs';
import { getProjects, getProjectPacks } from '../../actions/projects';

export class Form extends Component {

    state = {
        name: '',
        pack: null
    }

    static propTypes = {
        projects: PropTypes.array.isRequired,
        packs: PropTypes.array.isRequired,
        getProjects: PropTypes.func.isRequired,
        getProjectPacks: PropTypes.func.isRequired,
        addBatch: PropTypes.func.isRequired,
    }

    componentDidMount() {
        console.log("componentDidMount in batch form");
        this.props.getProjects();
    }

    componentDidUpdate() {
        console.log("componentDidUpdate in batch form");
        console.log(this.state)
    }

    onChange = e => { this.setState({ [e.target.name]: e.target.value }); }

    resetPacks = e => {
        this.props.getProjectPacks(e.target.value);
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("submit add batch");
        console.log(this.state)
        const { name, pack } = this.state;
        const batch = { name, pack };
        this.props.addBatch(batch);
    }

    render() {
        const { name, pack } = this.state;
        console.log("render in batch form");
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="batchname">Batch Name</label>
                        <input type="text" className="form-control" id="batchname" aria-describedby="batchnameHelp" placeholder="Enter new batch name"
                            name="name"
                            value={name}
                            onChange={this.onChange} />
                        <small id="batchnameHelp" className="form-text text-muted">the batch will collect tasks for one worker</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="projectSelect">Project</label>
                        <select defaultValue={'DEFAULT'} className="form-control" id="projectSelect" name="project" onChange={this.resetPacks}>
                            <option disabled value="DEFAULT" > -- select an project -- </option>
                            {this.props.projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="packSelect">Pack</label>
                        <select defaultValue={'DEFAULT'} className="form-control" id="packSelect" name="pack" onChange={this.onChange}>
                            <option disabled value="DEFAULT" > -- select an pack -- </option>
                            {this.props.packs.map(pack => (
                                <option key={pack.id} value={pack.id}>{pack.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    // state.reducer.initialState's content
    packs: state.projects.project_packs,
    projects: state.projects.projects

})

export default connect(mapStateToProps, { addBatch, getProjects, getProjectPacks })(Form);
