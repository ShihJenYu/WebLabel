import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import { IconButton } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CloseIcon from '@material-ui/icons/Close';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import SplitPane, { Pane } from 'react-split-pane';
import { Tree } from 'antd';


// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';

import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from 'react-contextmenu';
import './react-contextmenu.css';


import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GroupCards from './GroupCards';


import './splitpanel.css';
import 'antd/dist/antd.css';
import {
    createGroup, deleteGroup, selecteGroup, addItem2Group, sortItem2Group, renameGroup,
    hoverObject,
} from '../../actions/annotations';

const Container = styled.div`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 8px;
  overflow-y: scroll;
`;

const Item = styled.div`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 8px;
`;

export const getAnswerListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 4,
    width: 250,
});

const grid = 6;
export const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    textAlign: 'right',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

export class GroupsPanels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // groupingObjs: [],
            // selectedGroup: null,
            // hoverItem: null,
            // recode: {},
            // objIDsList: [1, 23, 4, 6, 5],
            anchorEl: null,
            anchorGroup: null,
            anchorFrame: null,
        };
    }

    componentDidMount() {

    }

    // static getDerivedStateFromProps(props, state) {
    //     if (props.objIDsList !== state.objIDsList) {
    //         return {
    //             objIDsList: props.objIDsList,
    //         };
    //     }

    //     // Return null to indicate no change to state.
    //     return null;
    // }

    handleCreateGroup = (e) => {
        const { currentFrame, groups, createGroup } = this.props;
        e.stopPropagation();
        e.preventDefault();
        let maxID = 0;
        if (groups[currentFrame]) {
            groups[currentFrame].forEach((item) => {
                if (item.id > maxID) {
                    maxID = item.id;
                }
            });
        }
        createGroup(maxID + 1, 'testG');
    }

    handleDeleteGroup = (e, targetID) => {
        const { deleteGroup } = this.props;
        e.stopPropagation();
        e.preventDefault();
        deleteGroup(targetID);
    }


    handleSelectGroup = (e, targetID) => {
        const { selecteGroup } = this.props;
        e.stopPropagation();
        e.preventDefault();
        selecteGroup(targetID);
        // const { groupingObjs } = this.state;
        // const selected = groupingObjs.find((item) => item.id === target.id);
        // console.log(selected);

        // this.setState({ selectedGroup: selected });
    }

    handleObjectSelect = (targetID) => {
        const { selectedGroup, addItem2Group } = this.props;
        // const { objIDsList } = this.state;
        if (selectedGroup.id && !selectedGroup.objIDs.includes(targetID)) {
            console.log('selectedGroup', selectedGroup, targetID);
            addItem2Group(targetID);
        }
        // const { recode, groupingObjs, selectedGroup } = this.state;
        // if (selectedGroup) {
        //     console.log(target, 'will in', selectedGroup);
        //     if (!(selectedGroup.id in recode)) {
        //         recode[selectedGroup.id] = [];
        //     }
        //     if (!(recode[selectedGroup.id].includes(target.id))) {
        //         recode[selectedGroup.id].push(target.id);
        //     }
        // }
        // console.log('current', recode);
        // this.setState({ recode });
    }

    handleObjectEnter = (target) => {
        // const { hoverItem } = this.state;
        // if (hoverItem == null || hoverItem.id === target.id) {
        //     this.setState({ hoverItem: target });
        // }
        const { hoverObject, hoverObjectID } = this.props;
        console.log('mouse enter', target.id);
        if (hoverObjectID !== target.id) {
            hoverObject(target.id);
        }
    }

    handleObjectLeave = (target) => {
        const { hoverObject } = this.props;
        console.log('mouse Leave', target.id);

        hoverObject('');
    }

    onDragEndItem = (result) => {
        const { source, destination } = result;
        const { selectedGroup, sortItem2Group } = this.props;
        // const { objIDsList } = this.state;
        if (!destination) {
            return;
        }
        const [remove] = selectedGroup.objIDs.splice(source.index, 1);
        selectedGroup.objIDs.splice(destination.index, 0, remove);

        console.log('before set selectedG.', selectedGroup.objIDs);
        sortItem2Group(selectedGroup);
        // this.setState({ objIDsList });
    }

    removeObjID = (id) => {
        const { selectedGroup, sortItem2Group } = this.props;

        selectedGroup.objIDs = selectedGroup.objIDs.filter((item) => item !== id);

        sortItem2Group(selectedGroup);
    }

    handleContextMenu = (e, group, frame) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('right click open menu');
        this.setState({
            anchorEl: e.currentTarget,
            anchorGroup: group,
            anchorFrame: frame,
        });
    }

    handleRenameGroup = (e, data) => {
        e.stopPropagation();
        e.preventDefault();

        // const { anchorGroup, anchorFrame } = this.state;
        const { renameGroup } = this.props;
        // console.log('right click open menu');
        // const { a, b } = { anchorGroup, anchorFrame };
        // anchorGroup.name = 'sss';
        renameGroup({ ...data.group, name: data.item }, data.frame);
        // this.setState({
        //     anchorEl: null,
        //     anchorGroup: null,
        //     anchorFrame: null,
        // });
    }
    // handleRenameGroup = (e) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     const { anchorGroup, anchorFrame } = this.state;
    //     const { renameGroup } = this.props;
    //     console.log('right click open menu');
    //     const { a, b } = { anchorGroup, anchorFrame };
    //     anchorGroup.name = 'sss';
    //     renameGroup(anchorGroup, anchorFrame);
    //     this.setState({
    //         anchorEl: null,
    //         anchorGroup: null,
    //         anchorFrame: null,
    //     });
    // }

    render() {
        // const { groupingObjs, selectedGroup, recode, hoverItem } = this.state;
        const {
            annotations, labels, currentFrame,
            groups, selectedGroup, selectedObject, hoverObjectID,
        } = this.props;
        const { anchorEl, anchorGroup, anchorFrame } = this.state;
        console.log('render selectedG.', selectedGroup);

        const currentAnnos = {};
        if (annotations && Object.keys(labels).length) {
            annotations.forEach((annotation) => {
                if (annotation.frame === currentFrame) {
                    if (!(annotation.label in currentAnnos)) {
                        currentAnnos[annotation.label] = [];
                    }
                    currentAnnos[annotation.label].push(annotation);
                }
            });
        }

        return (
            <div className="container pt-0" style={{ background: 'antiquewhite' }}>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                        maxHeight: '45vh',
                        minHeight: '45vh', // allHeightStr,
                    }}
                >
                    <div className="col" style={{ padding: '2px' }}>
                        {
                            Object.keys(currentAnnos).map((label_id) => (
                                <GroupCards
                                    labelname={labels[label_id].name}
                                    objects={currentAnnos[label_id]}
                                    hoverObjectID={hoverObjectID}
                                    // TODO fix hoverObjectID
                                    onObjectSelect={this.handleObjectSelect}
                                    onObjectEnter={this.handleObjectEnter}
                                    onObjectLeave={this.handleObjectLeave}
                                />
                            ))
                        }
                    </div>
                </div>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                        maxHeight: '45vh',
                        minHeight: '45vh', // allHeightStr,
                    }}
                >
                    <div className="col">
                        <SplitPane split="vertical" primary="second" minSize={150} maxSize={200} defaultSize={150}>
                            <div
                                className="bg_groupchip"
                                style={{
                                    height: '100%',
                                    display: 'block',
                                    overflow: 'scroll',
                                    padding: '2px',
                                    background: 'antiquewhite',
                                }}
                                onClick={(e) => { this.handleSelectGroup(e, -1); }}
                            >
                                {(groups[currentFrame]) ? groups[currentFrame].map((item) => (
                                    <div className="row">
                                        <div className="col-auto">
                                            <ContextMenuTrigger id="ssss" holdToDisplay={-1} item={item} collect={(props) => ({ group: props.item, frame: currentFrame })}>
                                                <Chip
                                                    variant="outlined"
                                                    label={`${item.name} : ${item.id}`}
                                                    color={(selectedGroup.id && (item.id === selectedGroup.id)) ? 'primary' : 'default'}
                                                    // TODO: maybe selectedObj will change color
                                                    onDelete={(e) => { this.handleDeleteGroup(e, item.id); }}
                                                    // TODO fix
                                                    onClick={(e) => { this.handleSelectGroup(e, item.id); }}
                                                // onContextMenu={(e) => { this.handleContextMenu(e, item, currentFrame); }}
                                                />
                                            </ContextMenuTrigger>
                                        </div>
                                    </div>
                                )) : ''}
                                <ContextMenu id="ssss">
                                    <SubMenu title="Left" hoverDelay={100}>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'L-1' }}>L-1</MenuItem>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'L-2' }}>L-2</MenuItem>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'L-3' }}>L-3</MenuItem>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'L-4' }}>L-4</MenuItem>
                                    </SubMenu>
                                    <SubMenu title="Right" hoverDelay={100}>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'R-1' }}>R-1</MenuItem>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'R-2' }}>R-2</MenuItem>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'R-3' }}>R-3</MenuItem>
                                        <MenuItem onClick={this.handleRenameGroup} data={{ item: 'R-4' }}>R-4</MenuItem>
                                    </SubMenu>
                                </ContextMenu>
                                {/* <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => { this.setState({ anchorEl: null, anchorGroup: null, anchorFrame: null }); }}
                                >
                                    <MenuItem onClick={this.handleRenameGroup}>Profile</MenuItem>
                                </Menu> */}
                            </div>
                            <div
                                style={{ padding: '2px', background: 'darkseagreen', height: '100%', overflowY: 'scroll' }}
                            >
                                <DragDropContext onDragEnd={(e) => { this.onDragEndItem(e); }}>
                                    <Droppable droppableId="droppableLabelsa">
                                        {(provided, snapshot) => (
                                            <div
                                                className="containera"
                                                ref={provided.innerRef}
                                            // style={getAnswerListStyle(snapshot.isDraggingOver)}
                                            >
                                                {(selectedGroup.id)
                                                    ? selectedGroup.objIDs.map((item, index) => (
                                                        <Draggable
                                                            key={`obj_${item}`}
                                                            draggableId={`obj_${item}`}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                // <div
                                                                //     // className="row"
                                                                //     ref={p.innerRef}
                                                                //     {...p.draggableProps}

                                                                // >
                                                                //     <span {...p.dragHandleProps}>
                                                                //         @@
                                                                //         </span>
                                                                //     <button>
                                                                //         {objID}
                                                                //     </button>
                                                                // </div>
                                                                <div
                                                                    className="rowa"
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                // style={getItemStyle(
                                                                //     snapshot.isDragging,
                                                                //     provided.draggableProps.style,
                                                                // )}
                                                                >
                                                                    <span {...provided.dragHandleProps}>
                                                                        <DragHandleIcon />
                                                                    </span>
                                                                    <span>
                                                                        {item}
                                                                    </span>
                                                                    {/* <div className="col-auto p-0">

                                                                    </div> */}
                                                                    {/* <div className="col-auto mr-auto">
                                                                    </div> */}
                                                                    <span className="float-right">
                                                                        <IconButton
                                                                            aria-label="delete"
                                                                            size="small"
                                                                            onClick={() => { this.removeObjID(item); }}
                                                                        >
                                                                            <CloseIcon fontSize="inherit" />
                                                                        </IconButton>
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                    : ''}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </SplitPane>
                    </div>
                </div>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                    }}
                >
                    <div className="col" style={{ padding: '2px', background: 'antiquewhite' }}>
                        <button
                            onClick={this.handleCreateGroup}
                        >
                            create group node
                        </button>
                    </div>

                </div>
            </div >
        );
    }
}

GroupsPanels.propTypes = {
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    labels: PropTypes.object,
    currentFrame: PropTypes.number.isRequired,
    selectedObject: PropTypes.object,
    hoverObjectID: PropTypes.any.isRequired,
    groups: PropTypes.arrayOf(PropTypes.any).isRequired,
    selectedGroup: PropTypes.object,
    objIDsList: PropTypes.arrayOf(PropTypes.any).isRequired,


    createGroup: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    selecteGroup: PropTypes.func.isRequired,
    addItem2Group: PropTypes.func.isRequired,
    sortItem2Group: PropTypes.func.isRequired,
    renameGroup: PropTypes.func.isRequired,
    hoverObject: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    labels: state.annotations.labels,
    currentFrame: state.annotations.currentFrame,
    selectedObject: state.annotations.selectedObject,
    hoverObjectID: state.annotations.hoverObjectID,
    groups: state.annotations.groups,
    selectedGroup: state.annotations.selectedGroup,
    objIDsList: state.annotations.selectedGroup.objIDs,
});

export default connect(mapStateToProps, {
    createGroup, deleteGroup, selecteGroup, addItem2Group, sortItem2Group, renameGroup,
    hoverObject,
})(GroupsPanels);
