import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { Modal } from 'react-bootstrap';
import Editor from './Editor';

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

            openLEdit: false,
            openSpecEdit: false,

            label: {
                id: -1,
                name: '',
                project: -1,
                order: 99,
            },
            orderLabels: [],

            attributespec: {
                id: -1,
                name: '',
                mutable: true,
                attrtype: '',
                default_value: '',
                values: '',
                label: -1,
                order: 99,
            },
            orderAttributespecs: [],

            tmpIndex: 0,
        };
    }

    componentDidMount() {
        const { getProjects } = this.props;
        getProjects();
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeLabelValue = (e) => {
        const { label } = this.state;
        console.log('label', label, e.target.name);

        const newLabel = { ...label, [e.target.name]: e.target.value };
        this.setState({ label: newLabel });
    }

    onChangeAttributeSpecValue = (e) => {
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
                selectedAnnotators: res.data.in,

                openLEdit: false,
                openSpecEdit: false,

                label: {
                    id: -1,
                    name: '',
                    project: -1,
                    order: 99,
                },
                orderLabels: res2.data,
                attributespec: {
                    id: -1,
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                    order: 99,
                },
                orderAttributespecs: [],
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
            const { orderLabels } = this.state;
            const res = await axios.get(`/api/v1/attributespecs/?label=${id}`);
            console.log('attr', res.data);
            const label = orderLabels.find((item) => item.id === id);
            this.setState({
                openLEdit: true,
                openSpecEdit: false,

                label,
                attributespec: {
                    id: -1,
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                    order: 99,
                },
                orderAttributespecs: res.data,
            });
        }
    }

    onOpenLabelEditor = (e, id) => {
        e.stopPropagation();
        if (id > -1) {
            // for modfify exist label
            this.getLabelAttributespecs(id);
        } else {
            // for create new label default
            this.setState({
                openLEdit: true,
                openSpecEdit: false,

                label: {
                    id: -1,
                    name: '',
                    project: -1,
                    order: 99,
                },
                attributespec: {
                    id: -1,
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                    order: 99,
                },
                orderAttributespecs: [],
            });
        }
    }

    onCloseLabelEditor = () => {
        this.setState({
            openLEdit: false,
            openSpecEdit: false,

            label: {
                id: -1,
                name: '',
                project: -1,
                order: 99,
            },
            attributespec: {
                id: -1,
                name: '',
                mutable: true,
                attrtype: '',
                default_value: '',
                values: '',
                label: -1,
                order: 99,
            },
            orderAttributespecs: [],
        });
    }

    onOpenSpecEditor = (e, id) => {
        e.stopPropagation();
        const { orderAttributespecs } = this.state;
        if (id !== -1) {
            // for modfify exist attr
            const attributespec = orderAttributespecs.find((item) => item.id === id);
            this.setState({
                openSpecEdit: true,
                attributespec,
            });
        } else {
            this.setState({
                // for create new attr default
                openSpecEdit: true,
                attributespec: {
                    id: -1,
                    name: '',
                    mutable: true,
                    attrtype: '',
                    default_value: '',
                    values: '',
                    label: -1,
                    order: 99,
                },
            });
        }
    }

    onCloseSpecEditor = () => {
        // this.getUsers(id, name);
        this.setState({
            openSpecEdit: false,
            attributespec: {
                id: -1,
                name: '',
                mutable: true,
                attrtype: '',
                default_value: '',
                values: '',
                label: -1,
                order: 99,
            },
        });
    }


    onDragEndLabel = (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const { orderLabels, label } = this.state;
        const [remove] = orderLabels.splice(source.index, 1);
        orderLabels.splice(destination.index, 0, remove);
        orderLabels.forEach((item, index) => {
            item.order = index + 1;
            if (item.id === label.id) {
                label.order = item.order;
            }
        });
        this.setState({ orderLabels });
    }

    onSaveOrder = async () => {
        const { orderLabels } = this.state;
        const res = await axios.post('/api/v1/labels/updateOrder/', { labels: orderLabels });
        console.log('response', res);
    }

    onDragEndAttributespec = (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const { orderAttributespecs, attributespec } = this.state;
        const [remove] = orderAttributespecs.splice(source.index, 1);
        orderAttributespecs.splice(destination.index, 0, remove);
        orderAttributespecs.forEach((item, index) => {
            item.order = index + 1;
            if (item.id === attributespec.id) {
                attributespec.order = item.order;
            }
        });
        this.setState({ orderAttributespecs });
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

    createWithAttrSpecs = async () => {
        console.log('on createWithAttrSpecs');
        const {
            project_id, label, orderLabels, orderAttributespecs,
        } = this.state;
        if (label.id === -1 && label.name !== '') {
            console.log('create new label with orderAttributespecs');
            label.project = project_id;
            label.order = orderLabels.length + 1;
            const formData = { label, attributespecs: orderAttributespecs };
            console.log('formData', formData);
            const res = await axios.post('/api/v1/labels/createWithAttrSpec/', formData);
            console.log('response', res);
            this.setState({
                orderLabels: res.data.labels,
                orderAttributespecs: res.data.attributespecs,
                openLEdit: false,
                openSpecEdit: false,

                // label: res.data.label,
            });
        } else if (label.id > -1 && label.name !== '') {
            console.log('update old label with orderAttributespecs');
            const formData = { label, attributespecs: orderAttributespecs };
            console.log('formData', formData);
            const res = await axios.post('/api/v1/labels/createWithAttrSpec/', formData);
            console.log('response', res);
            this.setState({
                orderLabels: res.data.labels,
                orderAttributespecs: res.data.attributespecs,
                openLEdit: false,
                openSpecEdit: false,

                // label: res.data.label,
            });
        } else {
            console.log('need use saveAttributeSpec');
        }
    }

    onCreateLabel = () => {
        this.createWithAttrSpecs();
    }

    onSaveLabel = () => {
        this.createWithAttrSpecs();
        console.log('on onSaveLabel');
    }

    createAttrSpec = () => {
        console.log('on createAttrSpec');
        const {
            label, orderAttributespecs, attributespec, tmpIndex,
        } = this.state;
        if (attributespec.id === -1) {
            console.log('attributespec id', attributespec.id);
            attributespec.id = `tmp_${tmpIndex}`;
            attributespec.label = label.id;
            attributespec.order = orderAttributespecs.length + 1;
            const newTmpIndex = tmpIndex + 1;
            const newOrderAttributespecs = [...orderAttributespecs, attributespec];
            console.log('attributespec will change id to add in orderAttributespecs');
            this.setState({
                orderAttributespecs: newOrderAttributespecs,
                tmpIndex: newTmpIndex,
                openSpecEdit: false,
            });
        } else {
            console.log('u cannot in this, need use saveAttributeSpec');
        }
    }

    onCreateAttributeSpec = () => {
        this.createAttrSpec();
    }

    onSaveAttributeSpec = () => {
        console.log('on saveAttributeSpec');
        const {
            orderAttributespecs, attributespec,
        } = this.state;
        if (attributespec.id === -1) {
            console.log('u cannot in this, need use createAttrSpec');
        } else {
            const newOrderAttributespecs = orderAttributespecs.map((attrSpec) => {
                if (attrSpec.id === attributespec.id) { return attributespec; } return attrSpec;
            });
            this.setState({
                orderAttributespecs: newOrderAttributespecs,
                openSpecEdit: false,
            });
        }
    }


    render() {
        const {
            project_id, project_name,
            expanded, project_newname,
            rename, project_rename,
            edit, annotators, selectedAnnotators,

            openLEdit, openSpecEdit,
            label, orderLabels,
            attributespec, orderAttributespecs,
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
                            onHide={this.onCloseEditor}
                            annotators={annotators}
                            selectedAnnotators={selectedAnnotators}
                            onChangeAnnotators={this.onChangeAnnotators}
                            onResetAnnotators={this.onResetAnnotators}

                            orderLabels={orderLabels}
                            onDragEndLabel={this.onDragEndLabel}
                            onSaveOrder={this.onSaveOrder}

                            openLEdit={openLEdit}
                            onOpenLabelEditor={this.onOpenLabelEditor}
                            onCloseLabelEditor={this.onCloseLabelEditor}

                            openSpecEdit={openSpecEdit}
                            onOpenSpecEditor={this.onOpenSpecEditor}
                            onCloseSpecEditor={this.onCloseSpecEditor}

                            label={label}
                            onChangeLabelValue={this.onChangeLabelValue}
                            onCreateLabel={this.onCreateLabel}
                            onSaveLabel={this.onSaveLabel}

                            orderAttributespecs={orderAttributespecs}
                            onDragEndAttributespec={this.onDragEndAttributespec}

                            attributespec={attributespec}
                            onChangeAttributeSpecValue={this.onChangeAttributeSpecValue}
                            onCreateAttributeSpec={this.onCreateAttributeSpec}
                            onSaveAttributeSpec={this.onSaveAttributeSpec}
                        />
                    </div>
                </div>
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
