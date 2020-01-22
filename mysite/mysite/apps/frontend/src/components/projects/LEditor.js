import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Tab, Tabs } from 'react-bootstrap';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import TuneIcon from '@material-ui/icons/Tune';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import TextField from '@material-ui/core/TextField';

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
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        const { attributespecs, onDragEndAttributespec,
            onCloseLabelEditor, editingLabelID, editingSpecID,
            openSpecEdit, onOpenSpecEditor, onCloseSpecEditor,
            onChangeAttrText, onChangeInputText, labelName, attributespecName, attributespec,
            onCreateLabel, onCreateAttributeSpec,
        } = this.props;

        let SpecButton = null;
        if (editingSpecID !== -1) {
            SpecButton = (
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<SaveIcon fontSize="small" />}
                >
                    Save
                </Button>
            );
        } else {
            SpecButton = (
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={onCreateAttributeSpec}
                >
                    Create
                </Button>
            );
        }

        const attributespecsContent = (
            <div className="card" style={{ marginBottom: '1px' }}>
                <div className="card-header p-0">
                    Attribute Settings
                    <IconButton className="float-right p-0" aria-label="delete" onClick={onCloseSpecEditor}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="card-body p-1">
                    <div className="container">
                        <div className="row align-items-center pb-2">
                            <div className="col" style={{ maxWidth: '200px' }}>
                                <input
                                    type="text"
                                    id="attributespecName"
                                    name="name"
                                    placeholder="attribute name"
                                    style={{ maxWidth: '100%' }}
                                    value={attributespec.name}
                                    onChange={onChangeAttrText}
                                />
                            </div>
                            <div className="col-auto">
                                {SpecButton}
                            </div>
                        </div>
                        <div className="row align-items-center pb-2">
                            <div className="col-auto">
                                Type
                            </div>
                            <div className="col">
                                <Select
                                    native
                                    id="attributespecType"
                                    name="attrtype"
                                    value={attributespec.attrtype}
                                    onChange={onChangeAttrText}
                                >
                                    <option value="select">select</option>
                                    <option value="text">text</option>
                                    <option value="number">number</option>
                                </Select>
                            </div>

                        </div>
                        <div className="row">
                            {/* ToDo */}
                            {/* Select decide this content  */}
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
        );

        let LEditButton = null;
        if (editingLabelID !== -1) {
            LEditButton = (
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<SaveIcon fontSize="small" />}
                // onClick={onCreateLabel}
                >
                    Save
                </Button>
            );
        } else {
            LEditButton = (
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={onCreateLabel}
                >
                    Create
                </Button>
            );
        }


        return (
            <div className="col" style={{ maxWidth: '800px' }}>
                <div className="card">
                    <div className="card-header">
                        Settings
                        <IconButton
                            className="float-right p-0"
                            aria-label="delete"
                            onClick={onCloseLabelEditor}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center mb-1">
                            <div className="col-4">
                                <TextField
                                    label="Label Name"
                                    id="labelName"
                                    name="labelName"
                                    size="small"
                                    value={labelName}
                                    onChange={onChangeInputText}
                                />
                            </div>
                            <div className="col-auto">
                                {LEditButton}
                            </div>
                        </div>
                        <Tabs defaultActiveKey="labels" transition={false} id="noanim-tab-example">
                            <Tab eventKey="raw" title="Raw">
                                <div className="row">
                                    <div className="col">
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
                                <div className="row align-items-center">
                                    <div className="col-3 mt-2">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<AddIcon fontSize="small" />}
                                            onClick={(e) => { onOpenSpecEditor(e, -1); }}
                                        >
                                            Attribute
                                        </Button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <DragDropContext onDragEnd={onDragEndAttributespec}>
                                            <Droppable droppableId="droppableAttributespecs">
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
                                                                            <IconButton edge="end" aria-label="edit" onClick={(e) => { onOpenSpecEditor(e, t.id); }}>
                                                                                <TuneIcon fontSize="small" />
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
                                        {openSpecEdit ? attributespecsContent : null}
                                    </div>
                                    {/* from edit button click props data [...] */}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>


            </div>
        );
    }
}

LEditor.propTypes = {
    // show: PropTypes.bool.isRequired,
    // project_id: PropTypes.number.isRequired,
    // project_name: PropTypes.string.isRequired,
    // project_users: PropTypes.shape({
    //     in: PropTypes.array,
    //     all: PropTypes.array,
    // }).isRequired,
    // parentCallHide: PropTypes.func.isRequired,

    editingLabelID: PropTypes.number.isRequired,
    editingSpecID: PropTypes.number.isRequired,
    labelName: PropTypes.string.isRequired,
    attributespecName: PropTypes.string.isRequired,
    attributespec: PropTypes.shape(PropTypes.any).isRequired,
    attributespecs: PropTypes.arrayOf(PropTypes.any).isRequired,
    onDragEndAttributespec: PropTypes.func.isRequired,
    onCloseLabelEditor: PropTypes.func.isRequired,
    onOpenSpecEditor: PropTypes.func.isRequired,
    onCloseSpecEditor: PropTypes.func.isRequired,


    onChangeAttrText: PropTypes.func.isRequired,
    onChangeInputText: PropTypes.func.isRequired,
    onCreateLabel: PropTypes.func.isRequired,
    onCreateAttributeSpec: PropTypes.func.isRequired,
};

export default connect(null, {})(LEditor);
