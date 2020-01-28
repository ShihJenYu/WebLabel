import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'font-awesome/css/font-awesome.min.css';


import { Tab, Tabs } from 'react-bootstrap';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import TuneIcon from '@material-ui/icons/Tune';

import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import LEditor from './LEditor';


const Container = styled.div`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 8px;
  max-height: calc(100vh - 174px);
  min-height: calc(100vh - 174px);;
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
        };
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     console.log('getDerivedStateFromProps', nextProps, prevState);
    //     if (nextProps.project_id !== prevState.project_id) {
    //         return {
    //             show: nextProps.show,
    //             project_id: nextProps.project_id,
    //             project_name: nextProps.project_name,
    //             selected: nextProps.project_users.in.sort(),
    //             project_users: nextProps.project_users,
    //         };
    //     }
    //     return null;
    // }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    onSaveAnnotators = async () => {
        const { selectedAnnotators, project_id } = this.props;
        const res = await axios.post(`/api/v1/projects/${project_id}/users/`, { selected: selectedAnnotators });
        console.log('in save,', res);
    };

    handleLabelOpen = (e, id) => {
        e.stopPropagation();
        console.log('handleLabelOpen');
        this.getLabelAttributespecs(id);
    }

    render() {
        const {
            show, project_name, onHide,
            annotators, selectedAnnotators, onChangeAnnotators, onResetAnnotators,

            openLEdit, onOpenLabelEditor, onCloseLabelEditor,
            openSpecEdit, onOpenSpecEditor, onCloseSpecEditor,

            orderLabels, onDragEndLabel, onSaveOrder,
            label, onChangeLabelValue, onCreateLabel, onSaveLabel,

            orderAttributespecs, onDragEndAttributespec,
            attributespec, onChangeAttributeSpecValue, onCreateAttributeSpec, onSaveAttributeSpec,
        } = this.props;

        const annotatorSelected = [...selectedAnnotators].sort();

        const tmp = [...annotators.all].sort();
        const annotatorOptions = tmp.map((item) => ({ value: item, label: item }));

        const LEDitorContent = (
            <LEditor
                onCloseLabelEditor={onCloseLabelEditor}

                openSpecEdit={openSpecEdit}
                onOpenSpecEditor={onOpenSpecEditor}
                onCloseSpecEditor={onCloseSpecEditor}

                label={label}
                onChangeLabelValue={onChangeLabelValue}
                onCreateLabel={onCreateLabel}
                onSaveLabel={onSaveLabel}

                orderAttributespecs={orderAttributespecs}
                onDragEndAttributespec={onDragEndAttributespec}

                attributespec={attributespec}
                onChangeAttributeSpecValue={onChangeAttributeSpecValue}
                onCreateAttributeSpec={onCreateAttributeSpec}
                onSaveAttributeSpec={onSaveAttributeSpec}
            />
        );
        let content = null;

        if (show) {
            content = (
                <>
                    <div className="row">
                        <div className="col">
                            <h2>{project_name}</h2>
                        </div>
                        <div className="col">
                            <button onClick={onHide}>Close</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Tabs defaultActiveKey="labels" transition={false} id="noanim-tab-example">
                                <Tab eventKey="annotatiors" title="Annotatiors">
                                    <div className="container py-2">
                                        <div className="row">
                                            <div className="mr-auto">Available</div>
                                            <div className="mr-auto">Chosen</div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <DualListBox
                                                    canFilter
                                                    options={annotatorOptions}
                                                    selected={annotatorSelected}
                                                    onChange={onChangeAnnotators}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col">
                                                <button onClick={this.onSaveAnnotators} className="btn btn-block btn-secondary">
                                                    Save
                                                </button>
                                            </div>
                                            <div className="col">
                                                <button onClick={onResetAnnotators} className="btn btn-block btn-secondary">
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="labels" title="Labels">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-auto">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<AddIcon fontSize="small" />}
                                                    onClick={(e) => { onOpenLabelEditor(e, -1); }}
                                                >
                                                    Label
                                                </Button>
                                            </div>
                                            <div className="col-auto">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<AddIcon fontSize="small" />}
                                                    onClick={() => { onSaveOrder(); }}
                                                >
                                                    Save Order
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col" style={{ maxWidth: '300px' }}>
                                                <DragDropContext onDragEnd={onDragEndLabel}>
                                                    <Droppable droppableId="droppableLabels">
                                                        {(provided) => (
                                                            <Container
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                            >
                                                                {orderLabels.map((t, i) => (
                                                                    <Draggable key={t.id} draggableId={`label_${t.id}`} index={i}>
                                                                        {(p) => (
                                                                            <div>
                                                                                <Item
                                                                                    ref={p.innerRef}
                                                                                    {...p.draggableProps}
                                                                                    {...p.dragHandleProps}
                                                                                >
                                                                                    {t.name}
                                                                                    <IconButton edge="end" aria-label="edit" onClick={(e) => { onOpenLabelEditor(e, t.id); }}>
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
                                            {openLEdit ? LEDitorContent : null}
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </>
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
    onHide: PropTypes.func.isRequired,
    annotators: PropTypes.shape({
        in: PropTypes.arrayOf(PropTypes.any).isRequired,
        all: PropTypes.arrayOf(PropTypes.any).isRequired,
    }).isRequired,
    selectedAnnotators: PropTypes.arrayOf(PropTypes.any).isRequired,
    onChangeAnnotators: PropTypes.func.isRequired,
    onResetAnnotators: PropTypes.func.isRequired,

    orderLabels: PropTypes.arrayOf(PropTypes.any).isRequired,
    onDragEndLabel: PropTypes.func.isRequired,
    onSaveOrder: PropTypes.func.isRequired,

    openLEdit: PropTypes.bool.isRequired,
    onOpenLabelEditor: PropTypes.func.isRequired,
    onCloseLabelEditor: PropTypes.func.isRequired,

    openSpecEdit: PropTypes.bool.isRequired,
    onOpenSpecEditor: PropTypes.func.isRequired,
    onCloseSpecEditor: PropTypes.func.isRequired,

    // editingLabelID: PropTypes.number.isRequired,
    // labelName: PropTypes.string.isRequired,
    label: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        project: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }).isRequired,
    onChangeLabelValue: PropTypes.func.isRequired,
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
    onChangeAttributeSpecValue: PropTypes.func.isRequired,
    onCreateAttributeSpec: PropTypes.func.isRequired,
    onSaveAttributeSpec: PropTypes.func.isRequired,
};

export default connect(null, {})(Editor);
