import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import SplitPane, { Pane } from 'react-split-pane';
import { Tree } from 'antd';

import GroupCards from './GroupCards';

import './splitpanel.css';
import 'antd/dist/antd.css';
import { createGroup, deleteGroup, selecteGroup, addItem2Group } from '../../actions/annotations';


export class GroupsPanels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // groupingObjs: [],
            // selectedGroup: null,
            // hoverItem: null,
            // recode: {},
        };
    }

    componentDidMount() {

    }

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

    handleDeleteGroup = (targetID) => {
        const { deleteGroup } = this.props;
        deleteGroup(targetID);
    }


    handleSelectGroup = (targetID) => {
        const { selecteGroup } = this.props;
        selecteGroup(targetID);
        // const { groupingObjs } = this.state;
        // const selected = groupingObjs.find((item) => item.id === target.id);
        // console.log(selected);

        // this.setState({ selectedGroup: selected });
    }

    handleObjectSelect = (targetID) => {
        const { selectedGroup, addItem2Group } = this.props;
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
        const { hoverItem } = this.state;
        if (hoverItem == null || hoverItem.id === target.id) {
            this.setState({ hoverItem: target });
        }
    }

    handleObjectLeave = (target) => {
        this.setState({ hoverItem: null });
    }


    render() {
        // const { groupingObjs, selectedGroup, recode, hoverItem } = this.state;
        const {
            annotations, labels, currentFrame,
            groups, selectedGroup, selectedObject, hoverObjectID,
        } = this.props;

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
                        <SplitPane split="vertical" primary="second" minSize={150} defaultSize={150}>
                            <div
                                style={{
                                    height: '100%',
                                    display: 'block',
                                    overflow: 'scroll',
                                    padding: '2px',
                                    background: 'antiquewhite',
                                }}
                            >
                                {(groups[currentFrame]) ? groups[currentFrame].map((item) => (
                                    <div className="row">
                                        <div className="col">
                                            <Chip
                                                variant="outlined"
                                                label={`${item.name} : ${item.id}`}
                                                color={(selectedGroup.id && (item.id === selectedGroup.id)) ? 'primary' : 'default'}
                                                // TODO: maybe selectedObj will change color
                                                onDelete={() => { this.handleDeleteGroup(item.id); }}
                                                // TODO fix
                                                onClick={() => { this.handleSelectGroup(item.id); }}
                                            />
                                        </div>
                                    </div>
                                )) : ''}
                            </div>
                            <div
                                style={{ padding: '2px', background: 'darkseagreen' }}
                            >
                                {(selectedGroup.id)
                                    ? selectedGroup.objIDs.map((item) => (
                                        <div className="row">
                                            <div className="col">
                                                <button>
                                                    {item}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                    : ''
                                }
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
            </div>
        );
    }
}

GroupsPanels.propTypes = {
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    labels: PropTypes.object,
    currentFrame: PropTypes.number.isRequired,
    selectedObject: PropTypes.object,
    hoverObjectID: PropTypes.number.isRequired,
    groups: PropTypes.arrayOf(PropTypes.any).isRequired,
    selectedGroup: PropTypes.object,


    createGroup: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    selecteGroup: PropTypes.func.isRequired,
    addItem2Group: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    labels: state.annotations.labels,
    currentFrame: state.annotations.currentFrame,
    selectedObject: state.annotations.selectedObject,
    hoverObjectID: state.annotations.hoverObjectID,
    groups: state.annotations.groups,
    selectedGroup: state.annotations.selectedGroup,
});

export default connect(mapStateToProps, {
    createGroup, deleteGroup, selecteGroup, addItem2Group,
})(GroupsPanels);
