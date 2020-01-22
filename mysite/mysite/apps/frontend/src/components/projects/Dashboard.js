import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { Modal } from 'react-bootstrap';
import Editor from './Editor';
// import Form from './Form';
// import Projects from './Projects';


import {
    getProjects, addProject, deleteProject, renameProject,
} from '../../actions/projects';


const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);


export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project_id: -1,
            expanded: '', // use projectID

            project_name: '',
            project_rename: '',
            project_newname: '',

            rename: false,
            edit: false,

            annotators: { in: [], all: [] },
            selectedAnnotators: [],

            labels: [],
            reOrderLabels: [],

            openLEdit: false,
            labelName: '',
            attributespecName: '',
            attributespec: {
                name: '',
                mutable: true,
                attrtype: '',
                default_value: '',
                values: '',
                label: -1,
            },
            attributespecs: [],
            attributespecsTemp: [],

            editingLabelID: -1,
            editingSpecID: -1,


        };
    }

    componentDidMount() {
        const { getProjects } = this.props;
        getProjects();
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeAttrText = (e) => {
        const { attributespec } = this.state;
        console.log('attributespec', attributespec, e.target.name);

        const newAttr = { ...attributespec, [e.target.name]: e.target.value };
        this.setState({ attributespec: newAttr });
    }

    onCreateProject = () => {
        const { project_newname } = this.state;
        const { addProject } = this.props;
        const project = { name: project_newname };
        addProject(project);
        this.setState({ project_newname: '' });
    }

    onDeleteProject = (id) => {
        const { deleteProject } = this.props;
        // TODO close editor before delete
        deleteProject(id);
    }

    onOpenRename = (id, name) => {
        this.setState({
            rename: true,
            project_id: id,
            project_rename: name,
        });
    }

    onCloseRename = () => { this.setState({ rename: false }); }

    onSubmitRename = (e) => {
        e.preventDefault();
        const { project_id, project_rename } = this.state;
        const { renameProject } = this.props;
        const project = { name: project_rename };
        renameProject(project_id, project);
        this.onCloseRename();
    }

    async getUsers(id, name) {
        if (id) {
            const res = await axios.get(`/api/v1/projects/${id}/users/`);
            const res2 = await axios.get(`/api/v1/labels/?project=${id}`);

            this.setState({
                edit: true,
                project_id: id,
                project_name: name,
                annotators: res.data,
                labels: res2.data,
                reOrderLabels: res2.data,
                selectedAnnotators: res.data.in,

                openLEdit: false,
                labelName: '',
                attributespecName: '',
                attributespec: {
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                },
                openSpecEdit: false,
                editingLabelID: -1,
            });
        }
    }

    onOpenEditor = (id, name) => {
        this.getUsers(id, name);
    }

    onCloseEditor = () => { this.setState({ edit: false }); }

    onChangeAnnotators = (selected) => {
        this.setState({ selectedAnnotators: selected });
    }

    onResetAnnotators = () => {
        const { annotators } = this.state;
        this.setState({ selectedAnnotators: annotators.in });
    }

    async getLabelAttributespecs(id) {
        if (id) {
            const { labels } = this.state;
            const res = await axios.get(`/api/v1/attributespecs/?label=${id}`);
            const label = labels.find((item) => item.id === id);
            this.setState({
                openLEdit: true,
                openSpecEdit: false,
                editingLabelID: id,
                labelName: label.name,
                attributespecName: '',
                attributespec: {
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                },
                attributespecs: res.data,
                attributespecsTemp: res.data,
            });
        }
    }

    onOpenLabelEditor = (e, id) => {
        e.stopPropagation();
        if (id > -1) {
            this.getLabelAttributespecs(id);
        } else {
            this.setState({
                openLEdit: true,
                openSpecEdit: false,
                editingLabelID: -1,
                labelName: '',
                attributespecName: '',
                attributespec: {
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                },
                attributespecs: [],
                attributespecsTemp: [],
            });
        }
    }

    onCloseLabelEditor = () => {
        // this.getUsers(id, name);
        this.setState({
            openLEdit: false,
            labelName: '',
            attributespecName: '',
            attributespec: {
                name: '',
                mutable: true,
                attrtype: '',
                default_value: '',
                values: '',
                label: -1,
            },
            openSpecEdit: false,
        });
    }

    onOpenSpecEditor = (e, id) => {
        e.stopPropagation();
        if (id > -1) {
            this.setState({
                openSpecEdit: true,
                editingSpecID: id,
                attributespec: {
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                },
            });
        } else {
            this.setState({
                openSpecEdit: true,
                editingSpecID: -1,
            });
        }
    }

    onCloseSpecEditor = () => {
        // this.getUsers(id, name);
        this.setState({
            openSpecEdit: false,
            attributespec: {
                name: '',
                mutable: true,
                attrtype: '',
                default_value: '',
                values: '',
                label: -1,
            },
        });
    }


    onDragEndLabel = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) {
            return;
        }
        const { reOrderLabels } = this.state;
        const [remove] = reOrderLabels.splice(source.index, 1);
        reOrderLabels.splice(destination.index, 0, remove);
        this.setState({ reOrderLabels });
    }

    onDragEndAttributespec = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) {
            return;
        }
        const { attributespecs } = this.state;
        const [remove] = attributespecs.splice(source.index, 1);
        attributespecs.splice(destination.index, 0, remove);
        this.setState({ attributespecs });
    }

    handleChangePanel = (panel) => {
        const { expanded } = this.state;
        if (expanded === panel) {
            this.setState({
                expanded: '',
            });
        } else {
            this.setState({
                expanded: panel,
            });
        }
    }

    onCreateLabel = () => {
        this.createWithAttrSpecs();
    }

    onCreateAttributeSpec = () => {
        this.createAttrSpec();
    }

    async createWithAttrSpecs() {
        const { project_id, labelName, attributespecsTemp, labels, reOrderLabels } = this.state;
        if (labelName) {
            const formData = { label: { name: labelName, project: project_id }, attributespecs: attributespecsTemp };
            console.log('formData', formData);
            const res = await axios.post('/api/v1/labels/createWithAttrSpec/', formData);
            console.log('res', res);
            this.setState({
                labels: [...labels, res.data.label],
                reOrderLabels: [...reOrderLabels, res.data.label],

                // openLEdit: false,
                // labelName: '',
                // openSpecEdit: false,
                // editingLabelID: -1,
            });
        }
    }

    async createAttrSpec() {
        const { editingLabelID, attributespec, attributespecs, attributespecsTemp } = this.state;
        if (editingLabelID > -1) {
            // const formData = { ...attributespec, label: editingLabelID };
            // console.log('formData', formData);
            // const res = await axios.post('/api/v1/attributespecs/', formData);
            // console.log('res', res);

        }
        this.setState({
            attributespecsTemp: [...attributespecsTemp, { ...attributespec, label: `new_${editingLabelID}` }],
            // openLEdit: false,
            // labelName: '',
            // openSpecEdit: false,
            // editingLabelID: -1,
        });
    }

    render() {
        const {
            project_id, project_name,
            expanded, project_newname,
            rename, project_rename,
            edit, annotators, selectedAnnotators,
            labels, reOrderLabels,
            openLEdit, attributespecs, attributespecsTemp, labelName, attributespec, attributespecName,
            openSpecEdit,
            editingLabelID, editingSpecID,
        } = this.state;
        let projectPanel = null;

        const { projects } = this.props;
        if (projects) {
            projectPanel = projects.map((project) => (
                <ExpansionPanel
                    key={project.id}
                    expanded={expanded === project.id}
                    onChange={() => { this.handleChangePanel(project.id); }}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        {project.name}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className="col">
                            <button
                                className="btn btn-info btn-sm"
                                onClick={() => this.onOpenRename(project.id, project.name)}
                            >
                                Rename
                            </button>
                        </div>
                        <div className="col">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.onDeleteProject(project.id)}
                            >
                                Delete
                            </button>
                        </div>
                        <div className="col">
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => this.onOpenEditor(project.id, project.name)}
                            >
                                Edit
                            </button>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ));
        }

        return (

            <div className="container-fluid p-0">
                <div className="row" style={{ maxHeight: 'calc(100vh - 56px)', minHeight: 'calc(100vh - 56px)' }}>
                    <div
                        className="col"
                        style={{
                            maxWidth: '300px',
                            maxHeight: 'calc(100vh - 56px)',
                            borderRightStyle: 'solid',
                            borderWidth: '2px',
                            borderColor: 'gray',
                        }}
                    >
                        <div className="row align-items-center">
                            <div className="input-group" style={{ padding: '10px' }}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text">New</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="new project name"
                                    style={{ maxWidth: '149px' }}
                                    name="project_newname"
                                    value={project_newname}
                                    onChange={this.onChange}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={this.onCreateProject}
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className="col p-0 m-0"
                                style={{
                                    maxWidth: '300px',
                                    overflowY: 'scroll',
                                    maxHeight: 'calc(100vh - 56px - 58px)',
                                    minHeight: 'calc(100vh - 56px - 58px)',
                                }}
                            >
                                {projectPanel}
                                <Modal show={rename} onHide={this.onCloseRename} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Rename Modal</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form onSubmit={this.onSubmitRename}>
                                            <div className="form-group">
                                                <label htmlFor="projectname">Project Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="projectname"
                                                    aria-describedby="projectnameHelp"
                                                    placeholder="Enter new project name"
                                                    name="project_rename"
                                                    value={project_rename}
                                                    onChange={this.onChange}
                                                />
                                                <small id="projectnameHelp" className="form-text text-muted">Dont repeat existed project name</small>
                                            </div>
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-primary">Update</button>
                                            </div>
                                        </form>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <Editor
                            show={edit}
                            project_id={project_id}
                            project_name={project_name}
                            annotators={annotators}
                            selectedAnnotators={selectedAnnotators}
                            reOrderLabels={reOrderLabels}
                            onHide={this.onCloseEditor}
                            onChangeAnnotators={this.onChangeAnnotators}
                            onResetAnnotators={this.onResetAnnotators}

                            onDragEndLabel={this.onDragEndLabel}
                            onDragEndAttributespec={this.onDragEndAttributespec}

                            openLEdit={openLEdit}
                            labelName={labelName}
                            attributespecName={attributespecName}
                            attributespec={attributespec}
                            editingLabelID={editingLabelID}
                            attributespecs={attributespecsTemp}
                            onOpenLabelEditor={this.onOpenLabelEditor}
                            onCloseLabelEditor={this.onCloseLabelEditor}

                            openSpecEdit={openSpecEdit}
                            editingSpecID={editingSpecID}
                            onOpenSpecEditor={this.onOpenSpecEditor}
                            onCloseSpecEditor={this.onCloseSpecEditor}

                            onChangeAttrText={this.onChangeAttrText}
                            onChangeInputText={this.onChange}
                            onCreateLabel={this.onCreateLabel}
                            onCreateAttributeSpec={this.onCreateAttributeSpec}


                        />
                    </div>
                </div>
                {/* <br />
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
                    </div> */}

            </div>

        );
    }
}

Dashboard.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    getProjects: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    renameProject: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    projects: state.projects.projects,
});

export default connect(mapStateToProps, {
    getProjects, addProject, deleteProject, renameProject,
})(Dashboard);
