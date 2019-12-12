import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import axios from 'axios';
import ProjectSelect from '../myselect/ProjectSelect';
import PackSelect from '../myselect/PackSelect';

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            currentProject: { id: null, name: null },
            currentPack: { id: null, name: null },
            projectPacks: [],
        };
    }

    componentDidMount() {
        console.log(this.state, 'mount');
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('nextProps in batch form', nextProps);
        if (nextProps.show === false) {
            this.setState({ projectPacks: [] });
        }
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in batch form');
        console.log(this.state);
    }

    onChange = (e) => { this.setState({ [e.target.name]: e.target.value }); }

    handleProjectChange = (project, packs) => {
        console.log('selectProject, projectPacks', project, packs);
        const { currentProject, projectPacks, currentPack } = this.state;
        this.setState({
            currentProject: project,
            projectPacks: packs,
            currentPack: { id: null, name: null },
        },
        () => {
            console.log('handleProjectChange set', currentProject, projectPacks, currentPack);
        });
    }

    handlePackChange = (childData) => {
        const { currentPack } = this.state;
        this.setState({ currentPack: childData }, () => { console.log('handlePackChange set', childData, currentPack); });
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        const { name, currentPack } = this.state;
        const batch = { name, pack: currentPack.id };
        // const { addBatch } = this.props;
        this.add_batch(batch);
    }

    async add_batch(batch) {
        const { onAddBatch } = this.props;
        const res = await axios.post('/api/v1/batchs/', batch);
        console.log('add in batch', res.data);
        onAddBatch(res.data);
    }

    render() {
        const { show, parentCallHide } = this.props;
        const { name, projectPacks } = this.state;
        console.log('render in batch form');
        return (
            <div>
                <Modal show={show} onHide={parentCallHide} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Batch </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.onSubmit}>
                            <div className="container">
                                <div className="row p-3">
                                    <div className="col p-0">
                                        <ProjectSelect onProjectChange={this.handleProjectChange} />
                                    </div>
                                    <div className="col p-0">
                                        <PackSelect
                                            projectPacks={projectPacks}
                                            onPackChange={this.handlePackChange}
                                        />
                                    </div>
                                </div>
                                <div className="row p-3">
                                    <div className="col-9 p-0">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="batchname"
                                            aria-describedby="batchnameHelp"
                                            placeholder="Enter new pack name"
                                            name="name"
                                            value={name}
                                            onChange={this.onChange}
                                        />
                                        <small id="batchnameHelp" className="form-text text-muted">Dont create existed batch in pack</small>
                                    </div>
                                    <div className="col-3 p-0">
                                        <button type="submit" className="btn btn-primary">Create</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

Form.propTypes = {
    show: PropTypes.bool.isRequired,
    parentCallHide: PropTypes.func.isRequired,
    onAddBatch: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
//     // state.reducer.initialState's content
//     packs: state.projects.project_packs,
//     projects: state.projects.projects,
// });

export default connect(null, { })(Form);
