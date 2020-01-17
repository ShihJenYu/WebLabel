import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'font-awesome/css/font-awesome.min.css';


import { Tab, Tabs } from 'react-bootstrap';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import TuneIcon from '@material-ui/icons/Tune';
import CloseIcon from '@material-ui/icons/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Select from '@material-ui/core/Select';
import LEditor from './LEditor';


const Container = styled.div`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 8px;
  max-height: 300px;
  min-height: 300px;
  overflow-y: scroll;
`;

const Item = styled.div`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 8px;
`;

export class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            project_id: null,
            project_name: null,
            selected: [],
            project_users: { in: [], all: [] },

            openLEdit: false,
            labeleSelected: null,
            attributespecs: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('getDerivedStateFromProps', nextProps, prevState);
        if (nextProps.project_id !== prevState.project_id) {
            return {
                show: nextProps.show,
                project_id: nextProps.project_id,
                project_name: nextProps.project_name,
                selected: nextProps.project_users.in.sort(),
                project_users: nextProps.project_users,
            };
        }
        return null;
    }

    componentDidMount() {
        console.log('componentDidMount in project editor');

        console.log(this.state);
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in project editor');
        console.log(this.state);
    }

    onChange = (selected) => {
        this.setState({ selected });
    };

    onSave = async () => {
        const { selected, project_id } = this.state;
        const res = await axios.post(`/api/v1/projects/${project_id}/users/`, { selected });
        console.log('in save,', res);
    };

    onReset = () => {
        const { project_users } = this.state;
        this.setState({ selected: project_users.in });
    };

    async getLabelAttributespecs(id) {
        if (id) {
            const res = await axios.get(`/api/v1/attributespecs/?label=${id}`);
            console.log('res', res);
            this.setState({
                openLEdit: true,
                attributespecs: res.data,
            });
        }
    }

    handleLabelOpen = (e, id) => {
        e.stopPropagation();
        console.log('handleLabelOpen');
        this.getLabelAttributespecs(id);
    }

    onLEditorDragEnd = (result) => {
        console.log(result);
        const { source, destination, draggableId } = result;
        if (!destination) {
            return;
        }
        const { attributespecs } = this.state;
        const [remove] = attributespecs.splice(source.index, 1);
        attributespecs.splice(destination.index, 0, remove);
        console.log('dragend', attributespecs);
        this.setState({ attributespecs });
    }

    // handleListItemClick = (e, index) => {
    //     this.setState({ labeleSelected: index });
    // }

    render() {
        const {
            show, selected, project_name, project_users, labeleSelected, openLEdit, attributespecs,
        } = this.state;
        const { parentCallHide, labels } = this.props;

        const tmp = [...project_users.all].sort();
        const options = tmp.map((item) => ({ value: item, label: item }));
        console.log('options', options);

        let content = '';
        if (show) {
            content = (
                <Tabs defaultActiveKey="annotatiors" transition={false} id="noanim-tab-example">
                    <Tab eventKey="annotatiors" title="Annotatiors">
                        <div className="container py-2">
                            <div className="row">
                                <div className="col">
                                    <h2>{project_name}</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mr-auto">Available</div>
                                <div className="mr-auto">Chosen</div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <DualListBox
                                        canFilter
                                        options={options}
                                        selected={selected}
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col">
                                    <button onClick={this.onSave} className="btn btn-block btn-secondary">
                                        Save
                                    </button>
                                </div>
                                <div className="col">
                                    <button onClick={this.onReset} className="btn btn-block btn-secondary">
                                        Reset
                                    </button>
                                </div>
                                <div className="col">
                                    <button onClick={parentCallHide} className="btn btn-block btn-secondary">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="labels" title="Labels">
                        <div className="container py-2">
                            <div className="row">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<AddIcon fontSizesize="small" />}
                                >
                                    Label
                                </Button>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <Droppable droppableId="d">
                                            {(provided) => (
                                                <Container ref={provided.innerRef} {...provided.droppableProps}>
                                                    {labels.map((t, i) => (
                                                        <Draggable key={t.id} draggableId={`label_${t.id}`} index={i}>
                                                            {(p) => (
                                                                <div>
                                                                    <Item
                                                                        ref={p.innerRef}
                                                                        {...p.draggableProps}
                                                                        {...p.dragHandleProps}
                                                                    >
                                                                        {t.name}
                                                                        <IconButton edge="end" aria-label="edit" onClick={(e) => { this.handleLabelOpen(e, t.id); }}>
                                                                            <TuneIcon fontSizesize="small" />
                                                                        </IconButton>
                                                                    </Item>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </Container>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>

                                {openLEdit ? <LEditor attributespecs={attributespecs} onPropDragEnd={this.onLEditorDragEnd} /> : null}

                            </div>
                        </div>
                    </Tab>
                </Tabs>
            );
        }
        return (
            <>
                {content}
            </>
        );
    }
}

Editor.propTypes = {
    show: PropTypes.bool.isRequired,
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
    project_users: PropTypes.shape({
        in: PropTypes.array,
        all: PropTypes.array,
    }).isRequired,
    labels: PropTypes.arrayOf(PropTypes.any).isRequired,
    parentCallHide: PropTypes.func.isRequired,
};

export default connect(null, {})(Editor);
