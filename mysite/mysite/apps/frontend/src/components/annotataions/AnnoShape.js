import React, { Component } from 'react';
import ReactDom from 'react-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    updateObjPoint,
} from '../../actions/annotations';

class Circle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: {
                x: props.cx,
                y: props.cy,
                active: false,
                offset: {},
            },
        };
    }

    componentDidMount() {

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { position } = prevState;
        return {
            ...prevState,
            position: {
                ...position,
                x: nextProps.cx,
                y: nextProps.cy,
            },
        };
    }

    handlePointerDown = (e) => {
        const { position } = this.state;
        // left: 0, middle: 1, right: 2
        if (e.button === 0) {
            const el = e.target;
            const bbox = e.target.getBoundingClientRect();
            const x = e.clientX - bbox.left;
            const y = e.clientY - bbox.top;
            el.setPointerCapture(e.pointerId);
            console.log('04/07 mousedown', e.clientX, e.clientY, bbox.top, bbox.left);
            this.setState({
                position: {
                    ...position,
                    active: true,
                    offset: { x, y },
                },
            });
        }
    }

    handlePointerMove = (e) => {
        const { position } = this.state;
        const { updatePoint, geometry } = this.props;

        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;

        console.log('04/07, handlePointerMove', el);


        el.setPointerCapture(e.pointerId);
        const geometryScale = (geometry) ? geometry.scale : 1;

        if (position.active) {
            const nx = position.x - (position.offset.x - x) / geometryScale;
            const ny = position.y - (position.offset.y - y) / geometryScale;
            const px = position.x;
            const py = position.y;
            this.setState({
                position: {
                    ...position,
                    active: true,
                    x: nx,
                    y: ny,
                },
            }, updatePoint(nx, ny, { x: +px, y: +py }));
        }
    }

    handlePointerUp = (e) => {
        const { position } = this.state;
        this.setState({
            position: {
                ...position,
                active: false,
            },
        });
    };

    render() {
        const { position } = this.state;
        return (
            <circle
                {...this.props}
                cx={position.x}
                cy={position.y}
                onPointerDown={this.handlePointerDown}
                onPointerUp={this.handlePointerUp}
                onPointerMove={this.handlePointerMove}
            />
        );
    }
}

class Rect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: {
                x: props.x,
                y: props.y,
                width: props.width,
                height: props.height,
                // active: false,
                // offset: {},
            },
        };
    }

    componentDidMount() {

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { position } = prevState;
        return {
            ...prevState,
            position: {
                ...position,
                x: nextProps.x,
                y: nextProps.y,
                width: nextProps.width,
                height: nextProps.height,
            },
        };
    }

    render() {
        const { position } = this.state;
        return (
            <rect
                {...this.props}
                x={position.x}
                y={position.y}
                width={position.width}
                height={position.height}
            // TODO
            // onPointerDown={this.handlePointerDown}
            // onPointerUp={this.handlePointerUp}
            // onPointerMove={this.handlePointerMove}
            />
        );
    }
}

export class AnnoShape extends Component {
    constructor(props) {
        super(props);
        this.types = ['rectangle', 'polygon', 'polyline', 'points'];
        let box = {};
        if (props.shapetype === 'rectangle') {
            const initPoints = this.pointsStringToArray(props.points);
            box = {
                tl: { x: initPoints[0].x, y: initPoints[0].y },
                bl: { x: initPoints[0].x, y: initPoints[1].y },
                br: { x: initPoints[1].x, y: initPoints[1].y },
                tr: { x: initPoints[1].x, y: initPoints[0].y },
            };
        }
        this.state = {
            ...props,
            box,
            // objID: props.objID,
            // points: props.points,
            // selected: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.objID !== prevState.objID) {
            let box = {};
            if (nextProps.shapetype === 'rectangle') {
                const initPoints = nextProps.points.split(' ').map((item) => {
                    const pos = item.split(','); return { x: +pos[0], y: +pos[1] };
                });

                box = {
                    tl: { x: initPoints[0].x, y: initPoints[0].y },
                    bl: { x: initPoints[0].x, y: initPoints[1].y },
                    br: { x: initPoints[1].x, y: initPoints[1].y },
                    tr: { x: initPoints[1].x, y: initPoints[0].y },
                };
            }
            return {
                ...prevState,
                ...nextProps,
                box,
            };
        }
        return null;


    }

    pointsStringToArray = (points) => {
        const pointsArray = points.split(' ').map((item) => {
            const pos = item.split(','); return { x: +pos[0], y: +pos[1] };
        });
        return pointsArray;
    }

    testOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    handleonDrage = (e) => {
        // console.log('handleonDrage', e);
    }

    setDragging = (flag) => {
        this.setState({ dragging: flag });
    }

    regularizeRect = (prebox, pid, x, y) => {
        const newbox = { ...prebox };
        switch (pid) {
            case 'tl':
                newbox.tl = { x, y };
                newbox.tr = { ...newbox.tr, y };
                newbox.bl = { ...newbox.bl, x };
                break;
            case 'bl':
                newbox.bl = { x, y };
                newbox.tl = { ...newbox.tl, x };
                newbox.br = { ...newbox.br, y };
                break;
            case 'br':
                newbox.br = { x, y };
                newbox.tr = { ...newbox.tr, x };
                newbox.bl = { ...newbox.bl, y };
                break;
            case 'tr':
                newbox.tr = { x, y };
                newbox.tl = { ...newbox.tl, y };
                newbox.br = { ...newbox.br, x };
                break;
            default:
                break;
        }
        return newbox;
    }

    updateRectPoint = (x, y, pid) => {
        const { shapeIndex, updateObjPoint } = this.props;
        const { box } = this.state;

        const newbox = this.regularizeRect(box, pid, x, y);
        const shapeBox = {
            xtl: Number.MAX_SAFE_INTEGER,
            ytl: Number.MAX_SAFE_INTEGER,
            xbr: Number.MIN_SAFE_INTEGER,
            ybr: Number.MIN_SAFE_INTEGER,
        };
        Object.keys(newbox).forEach((key) => {
            shapeBox.xtl = Math.min(shapeBox.xtl, newbox[key].x);
            shapeBox.ytl = Math.min(shapeBox.ytl, newbox[key].y);
            shapeBox.xbr = Math.max(shapeBox.xbr, newbox[key].x);
            shapeBox.ybr = Math.max(shapeBox.ybr, newbox[key].y);
        });
        const points_str = `${shapeBox.xtl},${shapeBox.ytl} ${shapeBox.xbr},${shapeBox.ybr}`

        // console.log('newbox', newbox);

        this.setState({ box: newbox },
            updateObjPoint(shapeIndex, points_str));
    }

    updatePolyPoint = (x, y, pid) => {
        const { shapeIndex, shapetype, updateObjPoint } = this.props;
        const { points } = this.state;
        console.log('04/07, updatePolyPoint', pid, x, y);
        const pointsArray = this.pointsStringToArray(points);
        let points_str = '';

        pointsArray[pid] = { x, y };
        points_str = pointsArray.map((item) => (`${item.x},${item.y}`)).join(' ');

        this.setState({ points: points_str },
            updateObjPoint(shapeIndex, points_str));
    }

    render() {
        const { shapetype, shapeIndex, selectedObject, objID, selected, geometry } = this.props;
        const { box, points } = this.state;

        const shapeBox = {
            xtl: Number.MAX_SAFE_INTEGER,
            ytl: Number.MAX_SAFE_INTEGER,
            xbr: Number.MIN_SAFE_INTEGER,
            ybr: Number.MIN_SAFE_INTEGER,
        };

        Object.keys(box).forEach((key) => {
            shapeBox.xtl = Math.min(shapeBox.xtl, box[key].x);
            shapeBox.ytl = Math.min(shapeBox.ytl, box[key].y);
            shapeBox.xbr = Math.max(shapeBox.xbr, box[key].x);
            shapeBox.ybr = Math.max(shapeBox.ybr, box[key].y);
        });

        let content = '';
        const pointsArray = this.pointsStringToArray(points);

        switch (shapetype) {
            case 'rectangle':
                content = (
                    <>
                        <Rect
                            onClick={(e) => { console.log('rect on click', e.target); }}
                            style={{
                                stroke: '#edba80', strokeWidth: 2, strokeOpacity: 1, fill: '#edba80', fillOpacity: 0.2,
                            }}
                            x={shapeBox.xtl}
                            y={shapeBox.ytl}
                            width={shapeBox.xbr - shapeBox.xtl}
                            height={shapeBox.ybr - shapeBox.ytl}
                        />
                        {(selected) ? (
                            <g
                                style={{
                                    stroke: 'black', strokeWidth: 2, strokeOpacity: 1, fill: '#edba80', fillOpacity: 1,
                                }}
                            >
                                {
                                    Object.keys(box).map((key) => (
                                        <Circle
                                            geometry={geometry}
                                            onClick={(e) => { this.testOnClick(e); }}
                                            // updatePoint={this.updateRectPoint}
                                            updatePoint={(x, y) => { this.updateRectPoint(x, y, key); }}
                                            cx={box[key].x}
                                            cy={box[key].y}
                                            r="4"
                                        />
                                    ))
                                }
                            </g>
                        ) : ''}
                    </>
                );
                break;
            case 'polygon':
                content = (
                    <>
                        <polygon
                            points={points}
                            style={{
                                stroke: '#ffcc00', strokeWidth: 2, strokeOpacity: 1, fill: '#ffcc00', fillOpacity: 0.2,
                            }}
                        />
                        {(selected) ? (
                            <g
                                style={{
                                    stroke: 'black', strokeWidth: 2, strokeOpacity: 1, fill: '#ffcc00', fillOpacity: 1,
                                }}
                            >
                                {pointsArray.map((pt, pid) => (
                                    <Circle
                                        geometry={geometry}
                                        onClick={(e) => { this.testOnClick(e); }}
                                        updatePoint={(x, y) => { console.log(x, y, '04/07'); this.updatePolyPoint(x, y, pid); }}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                    />
                                ))}
                            </g>
                        ) : ''}
                    </>
                );
                break;
            case 'polyline':
                content = (
                    <>
                        <polyline
                            points={points}
                            fill="#3ddb8a"
                            stroke="#3ddb8a"
                            strokeWidth="2"
                            fillOpacity="0"
                            strokeOpacity="1"
                        />
                        {(selected) ? (
                            <g
                                style={{
                                    stroke: 'black', strokeWidth: 2, strokeOpacity: 1, fill: '#3ddb8a', fillOpacity: 1,
                                }}
                            >
                                {pointsArray.map((pt, pid) => (
                                    <Circle
                                        geometry={geometry}
                                        onClick={(e) => { this.testOnClick(e); }}
                                        updatePoint={(x, y) => { this.updatePolyPoint(x, y, pid); }}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                    />
                                ))}
                            </g>
                        ) : ''}
                    </>
                );
                break;
            case 'points':
                content = (
                    <>
                        {(selected) ? (
                            <g
                                style={{
                                    stroke: 'black', strokeWidth: 2, strokeOpacity: 1, fill: '#957de3', fillOpacity: 1,
                                }}
                            >
                                {pointsArray.map((pt, pid) => (
                                    <Circle
                                        geometry={geometry}
                                        onClick={(e) => { this.testOnClick(e); }}
                                        updatePoint={(x, y) => { this.updatePolyPoint(x, y, pid); }}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                    />
                                ))}
                            </g>
                        )
                            : (
                                <g
                                    style={{
                                        stroke: 'black', strokeWidth: 1, strokeOpacity: 1, fill: '#957de3', fillOpacity: 1,
                                    }}
                                >
                                    {pointsArray.map((pt, pid) => (
                                        <circle
                                            geometry={geometry}
                                            // onClick={(e) => { this.testOnClick(e); }}
                                            // updatePoint={(x, y) => { this.updatePolyPoint(x, y, pid); }}
                                            cx={pt.x}
                                            cy={pt.y}
                                            r="4"
                                        />
                                    ))}
                                </g>
                            )}
                    </>
                );
                break;
            default:
                break;
        }
        return (
            content
        );
    }
}


AnnoShape.propTypes = {
    // annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    // currentFrame: PropTypes.number.isRequired,
    points: PropTypes.string.isRequired,
    shapeIndex: PropTypes.number.isRequired,
    shapetype: PropTypes.string.isRequired,
    selectedObject: PropTypes.object,

};

const mapStateToProps = (state) => ({
    // annotations: state.annotations.annotations,
    selectedObject: state.annotations.selectedObject,
});

export default connect(mapStateToProps, { updateObjPoint })(AnnoShape);
