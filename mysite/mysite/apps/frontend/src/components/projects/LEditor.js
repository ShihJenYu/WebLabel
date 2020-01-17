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

export class LEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            project_id: null,
            project_name: null,
            selected: [],
            project_users: { in: [], all: [] },

            labeleSelected: null,
            attrs: [
                {
                    id: 'item-0',
                    content: 'item 0',
                },
                {
                    id: 'item-1',
                    content: 'item 1',
                },
                {
                    id: 'item-2',
                    content: 'item 2',
                },
                {
                    id: 'item-3',
                    content: 'item 3',
                },
                {
                    id: 'item-4',
                    content: 'item 4',
                },
                {
                    id: 'item-5',
                    content: 'item 5',
                },
            ],
        };
    }

    componentDidMount() {
        console.log('componentDidMount in project editor');

        console.log(this.state);
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in project editor');
        console.log(this.state);
    }

    // onChange = (selected) => {
    //     this.setState({ selected });
    // };

    // onSave = async () => {
    //     const { selected, project_id } = this.state;
    //     const res = await axios.post(`/api/v1/projects/${project_id}/users/`, { selected });
    //     console.log('in save,', res);
    // };

    // onReset = () => {
    //     const { project_users } = this.state;
    //     this.setState({ selected: project_users.in });
    // };

    onDragEnd = (result) => {
        console.log(result);
        const { source, destination, draggableId } = result;
        if (!destination) {
            return;
        }
        const { attrs } = this.state;
        const [remove] = attrs.splice(source.index, 1);
        attrs.splice(destination.index, 0, remove);
        this.setState({ attrs });
    }


    render() {
        const { attrs } = this.state;
        const { openLEdit, parentCallHide, attributespecs, onPropDragEnd } = this.props;

        console.log('haha attributespecs', attributespecs);

        if (openLEdit) {
            return '';
        }
        return (
            <div className="col-8" style={{ background: 'aliceblue' }}>
                <Tabs defaultActiveKey="raw" transition={false} id="noanim-tab-example">
                    <Tab eventKey="raw" title="Raw">
                        <div className="container">
                            <div className="row">
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    rows="15"
                                    variant="outlined"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="labels" title="Labels">
                        <div className="container py-2">
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <TextField
                                        label="Label Name"
                                        id="labelName"
                                        size="small"
                                    />
                                </div>
                                <div className="col-3 mt-2">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<AddIcon fontSizesize="small" />}
                                    >
                                        Attribute
                                    </Button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <DragDropContext onDragEnd={onPropDragEnd}>
                                        <Droppable droppableId="d">
                                            {(provided) => (
                                                <Container ref={provided.innerRef} {...provided.droppableProps}>
                                                    {attributespecs.map((t, i) => (
                                                        <Draggable key={t.id} draggableId={`attr_${t.id}`} index={i}>
                                                            {(p) => (
                                                                <div>
                                                                    <Item
                                                                        ref={p.innerRef}
                                                                        {...p.draggableProps}
                                                                        {...p.dragHandleProps}
                                                                    >
                                                                        {t.name}
                                                                        <IconButton edge="end" aria-label="edit">
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
                                <div className="col-8">
                                    <div className="card" style={{ marginBottom: '1px' }}>
                                        <div className="card-header p-0">
                                            menu
                                            <IconButton className="float-right p-0" aria-label="delete">
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                        <div className="card-body p-1">
                                            <div className="container">
                                                <div className="row align-items-center">
                                                    <div className="col-4">
                                                        <TextField
                                                            label="Attribute Name"
                                                            id="attributeName"
                                                            size="small"
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <IconButton size="small" aria-label="add" color="primary">
                                                            <AddBoxIcon fontSizesize="small" />
                                                        </IconButton>
                                                    </div>
                                                    <div className="col-1">
                                                        <IconButton size="small" aria-label="del" color="secondary">
                                                            <DeleteForeverIcon fontSizesize="small" />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        Type
                                                    </div>
                                                    <div className="col">
                                                        <Select
                                                            native
                                                            value="select"
                                                        // onChange={handleChange('age')}
                                                        // inputProps={{
                                                        //     name: 'age',
                                                        //     id: 'age-native-simple',
                                                        // }}
                                                        >
                                                            {/* <option value="" /> */}
                                                            <option value="select">select</option>
                                                            <option value="text">text</option>
                                                            <option value="number">number</option>
                                                        </Select>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        Value
                                                    </div>
                                                    <div className="col">
                                                        <TextField
                                                            id="outlined-multiline-static2"
                                                            multiline
                                                            rows="8"
                                                            variant="outlined"
                                                            style={{ width: '100%', background: 'white' }}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* from edit button click props data [...] */}
                            </div>
                        </div>
                    </Tab>
                </Tabs>

            </div>
        );
    }
}

LEditor.propTypes = {
    show: PropTypes.bool.isRequired,
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
    project_users: PropTypes.shape({
        in: PropTypes.array,
        all: PropTypes.array,
    }).isRequired,
    parentCallHide: PropTypes.func.isRequired,
    openLEdit: PropTypes.bool.isRequired,
    attributespecs: PropTypes.arrayOf(PropTypes.any).isRequired,
    onPropDragEnd: PropTypes.func.isRequired,
};

export default connect(null, {})(LEditor);
