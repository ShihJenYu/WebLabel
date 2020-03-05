import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        const {
            onCloseLabelEditor,
            openSpecEdit, onOpenSpecEditor, onCloseSpecEditor,

            label, onChangeLabelValue, onCreateLabel, onSaveLabel,

            orderAttributespecs, onDragEndAttributespec,
            attributespec, onChangeAttributeSpecValue, onCreateAttributeSpec, onSaveAttributeSpec,
        } = this.props;

        let SpecButton = null;
        console.log('attributespec in Leditor', attributespec);
        if (attributespec.id !== -1) {
            SpecButton = (
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<SaveIcon fontSize="small" />}
                    onClick={onSaveAttributeSpec}
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
                                    onChange={onChangeAttributeSpecValue}
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
                                    onChange={onChangeAttributeSpecValue}
                                >
                                    <option value="" disabled />
                                    <option value="checkbox">checkbox</option>
                                    <option value="radio">radio</option>
                                    <option value="text">text</option>
                                    <option value="number">number</option>
                                    <option value="select">select</option>
                                    <option value="multiselect">multiselect</option>
                                </Select>
                            </div>
                        </div>
                        <div className="row align-items-center pb-2">
                            {/* ToDo */}
                            {/* Select decide this content  */}
                            <div className="col-auto">
                                DefaultValue
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    id="attributespecDefaultValue"
                                    name="default_value"
                                    placeholder="default value"
                                    style={{ maxWidth: '100%' }}
                                    value={attributespec.default_value}
                                    onChange={onChangeAttributeSpecValue}
                                />
                            </div>
                        </div>
                        <div className="row align-items-center pb-2">
                            {/* ToDo */}
                            {/* Select decide this content  */}
                            <div className="col-auto">
                                Options
                            </div>
                            <div className="col">
                                <TextField
                                    id="attributespecValues"
                                    multiline
                                    rows="8"
                                    variant="outlined"
                                    name="values"
                                    style={{ width: '100%', background: 'white' }}
                                    value={attributespec.values.split(';').map((value) => value.trim()).join(';\n')}
                                    onChange={onChangeAttributeSpecValue}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        let LEditButton = null;
        if (label.id !== -1) {
            LEditButton = (
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<SaveIcon fontSize="small" />}
                    onClick={onSaveLabel}
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
                        Label Settings
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
                                    name="name"
                                    size="small"
                                    value={label.name}
                                    onChange={onChangeLabelValue}
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
                                                    <Container
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        {orderAttributespecs.map((t, i) => (
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
    onCloseLabelEditor: PropTypes.func.isRequired,

    openSpecEdit: PropTypes.bool.isRequired,
    onOpenSpecEditor: PropTypes.func.isRequired,
    onCloseSpecEditor: PropTypes.func.isRequired,

    // editingLabelID: PropTypes.number.isRequired, // merge  label
    // labelName: PropTypes.string.isRequired, // merge label
    label: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        project: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }).isRequired,
    onChangeLabelValue: PropTypes.func.isRequired, // on modify label
    onCreateLabel: PropTypes.func.isRequired,
    onSaveLabel: PropTypes.func.isRequired,

    orderAttributespecs: PropTypes.arrayOf(PropTypes.any).isRequired,
    onDragEndAttributespec: PropTypes.func.isRequired,

    // editingSpecID: PropTypes.number.isRequired,
    // attributespecName: PropTypes.string.isRequired,
    attributespec: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        mutable: PropTypes.bool.isRequired,
        attrtype: PropTypes.string.isRequired,
        default_value: PropTypes.string.isRequired,
        values: PropTypes.string.isRequired,
        label: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }).isRequired,
    onChangeAttributeSpecValue: PropTypes.func.isRequired, // on modify attribute
    onCreateAttributeSpec: PropTypes.func.isRequired,
    onSaveAttributeSpec: PropTypes.func.isRequired,
};

export default connect(null, {})(LEditor);
