import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import PlayerFrame from './PlayerFrame';
import { Players } from '../players/Players';
import { TabsPanels } from '../tabspanels/TabsPanels';

import {
    getAnnotations, patchAnnotations, getINITDATA,
    getLabels, changeDefaultLabel, createObject, getFrameStatus, setCurrentFrame,
} from '../../actions/annotations';

import MultipleSelect from '../myselect/MultipleSelect';

import FrameProvider from './FrameProvider';

export class Annotation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shapeType: 'rectangle',
        };
        this.shapeTypes = ['rectangle', 'polygon', 'polyline', 'points'];
        const token = localStorage.getItem('jwt_token');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
    }

    componentDidMount() {
        // TODO annotation need wait labels
        this.tid = window.location.search.match('id=[0-9]+')[0].slice(3);
        this.getData(this.tid);
    }

    componentDidUpdate(prevProps) {
        const { initialed, frameStatus } = this.props;
        if (initialed !== prevProps.initialed && initialed) {
            console.log('HAHAHA ,initialed');
            this.frameProvider = new FrameProvider(this.tid, frameStatus.length - 1, frameStatus);
            this.frameProvider.printA();
            this.frameProvider.require(0);
            this.geometry = {
                scale: 1,
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            };
            this.forceUpdate();
            // this.getCurrentImage(0);
        }
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     const { initialed, frameStatus } = prevState;
    //     if (initialed !== nextProps.initialed) {
    //         if (nextProps.initialed) {
    //             console.log('HAHAHA, initialed');
    //             this.frameProvider = new FrameProvider(this.tid, frameStatus.length - 1, frameStatus);
    //             this.frameProvider.printA();
    //             this.frameProvider.require(0);
    //         }
    //         if (nextProps.initialed !== initialed || nextProps.frameStatus !== frameStatus) {
    //             return {
    //                 initialed: nextProps.initialed, frameStatus: nextProps.frameStatus,
    //             };
    //         }
    //     }
    //     return null;
    // }

    setCurrentImage = (frame) => {
        if (!this.loadInterval && this.frameProvider) {
            const nextImg = this.frameProvider.require(frame);
            const { currentImage } = this.state;
            if (!nextImg || currentImage.src !== nextImg.src) {
                this.loadInterval = setInterval(() => {
                    const img = this.frameProvider.require(frame);
                    if (img) {
                        clearInterval(this.loadInterval);
                        this.loadInterval = null;
                        this.setState({ currentImage: img });
                    }
                }, (10));
            }
        }
    }

    getData = (taskID) => {
        const { getINITDATA } = this.props;
        getINITDATA(taskID);

        // const res = await axios.get(`/api/v1/tasks/${taskID}/project/`);
        // console.log('tasks_project', res.data);

        // await getLabels(res.data.id);
        // await getAnnotations(taskID);
        // await getFrameStatus(taskID);

        // const res2 = await axios.get('/api/v1/server/get_frame/');
        // const image = new Image();
        // image.src = '/api/v1/tasks/2/get_frame/?A=3&B=4';
        // console.log('imageA', image);
    }

    onChangeDefaultLabel = (e) => {
        const { changeDefaultLabel, labels } = this.props;
        console.log('test', e.target.value);
        const labelID = +Object.keys(labels).find((key) => (labels[key].name === e.target.value));

        changeDefaultLabel(labelID);
    }

    onChangeDefaultShapeType = (e) => {
        const { shapeType } = this.state;
        console.log('onChangeDefaultShapeType', e.target.value);
        this.setState({ shapeType: e.target.value });
    }

    createNewTest = (points, shapetype) => {
        const {
            createObject, defaultLabelID, labels, maxID, currentFrame,
        } = this.props;

        const selectedDefaultAttrs = labels[defaultLabelID].attributes;
        const attrs = {};

        Object.keys(selectedDefaultAttrs).forEach((attrID) => {
            attrs[attrID] = selectedDefaultAttrs[attrID].default_value;
        });

        const newObj = {
            id: `new_${(maxID + 1).toString()}`,
            frame: currentFrame,
            shapetype,
            shapeid: `new_${(maxID + 1).toString()}`,
            points,
            label: +defaultLabelID,
            attrs,
        };
        createObject(newObj);
    }

    saveTest = () => {
        console.log('saveTest');
        const { annotations, patchAnnotations } = this.props;
        patchAnnotations(this.tid, annotations);
    }

    render() {
        const { currentImage, shapeType } = this.state;
        const {
            labels, defaultLabelID, frameStatus, currentFrame, setCurrentFrame,
        } = this.props;
        const labelItems = Object.values(labels).map((item) => item.name);
        const defaultLabel = (defaultLabelID != null) ? [labels[defaultLabelID].name] : [labelItems[0]];

        this.setCurrentImage(currentFrame);
        // this.getCurrentImage(currentFrame);


        return (
            <div className="container-fluid" style={{ height: '100%' }}>
                <div className="row" style={{ height: '100%' }}>
                    <div className="col d-flex flex-column h-100">
                        <div className="row" style={{ height: '34px', background: 'darksalmon' }}>
                            <MultipleSelect
                                items={labelItems}
                                value={defaultLabel}
                                onChange={this.onChangeDefaultLabel}
                            />
                            <MultipleSelect
                                items={this.shapeTypes}
                                value={[shapeType]}
                                onChange={this.onChangeDefaultShapeType}
                            />
                            <input type="button" onClick={this.createNewTest} value="createNewTest" />
                            <input type="button" onClick={this.saveTest} value="saveTest" />
                        </div>
                        <div
                            className="row  flex-grow-1"
                            style={{ background: 'slategray' }}
                            ref={(cell) => { this.playerFrameCell = cell; }}
                        >
                            <PlayerFrame
                                currentImage={currentImage}
                                geometry={this.geometry}
                                shapeType={shapeType}
                                createNewObj={this.createNewTest}
                            />
                        </div>
                        <Players frameStatus={frameStatus} currentFrame={currentFrame} setCurrentFrame={setCurrentFrame} />
                    </div>
                    <div className="col" style={{ maxWidth: '350px', background: 'cadetblue' }}>
                        <TabsPanels />
                    </div>
                </div>
            </div>

        );
    }
}

Annotation.propTypes = {
    getINITDATA: PropTypes.func.isRequired,
    getAnnotations: PropTypes.func.isRequired,
    patchAnnotations: PropTypes.func.isRequired,
    getLabels: PropTypes.func.isRequired,
    getFrameStatus: PropTypes.func.isRequired,
    setCurrentFrame: PropTypes.func.isRequired,
    changeDefaultLabel: PropTypes.func.isRequired,
    labels: PropTypes.object,
    defaultLabelID: PropTypes.any,
    maxID: PropTypes.any,
    createObject: PropTypes.func.isRequired,
    annotations: PropTypes.any,
    frameStatus: PropTypes.any,
    currentFrame: PropTypes.any,
    initialed: PropTypes.bool,

};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    frameStatus: state.annotations.frameStatus,
    currentFrame: state.annotations.currentFrame,
    labels: state.annotations.labels,
    defaultLabelID: state.annotations.defaultLabelID,
    maxID: state.annotations.maxID,
    initialed: state.annotations.initialed,
});

export default connect(
    mapStateToProps,
    {
        getAnnotations,
        patchAnnotations,
        getLabels,
        getFrameStatus,
        changeDefaultLabel,
        createObject,
        setCurrentFrame,
        getINITDATA,
    },
)(Annotation);
