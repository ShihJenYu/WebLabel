import React, { Component } from 'react';
import ReactDom from 'react-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import {
    updateObjPoint,
} from '../../actions/annotations';

// import * as d3 from 'd3';

// function makeDraggable(comp) {
//     let translateX = 0;
//     let translateY = 0;
//     const handleDrag = d3.drag()
//         .subject(() => {
//             const me = d3.select(this);
//             return { x: translateX, y: translateY };
//         })
//         .on('drag', () => {
//             const me = d3.select(this);
//             const transform = `translate(${d3.event.x}, ${d3.event.y})`;
//             translateX = d3.event.x;
//             translateY = d3.event.y;
//             me.attr('transform', transform);
//             console.log('comp.node', comp.node);
//             console.log('me', me);
//         });
//     // const node = ReactDOM.findDOMNode(comp);
//     handleDrag(d3.select(comp.node));
// }

class Circle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            position: {
                x: props.cx,
                y: props.cy,
                active: false,
                offset: {},
            },
        };
    }

    componentDidMount() {
        // makeDraggable(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { dragging, position } = prevState;
        console.log('pre', dragging);
        console.log('next', nextProps.dragging);
        if (dragging.toString() === 'true' && nextProps.dragging === 'false') {
            return {
                ...prevState,
                dragging: false,
                position: {
                    ...position,
                    x: nextProps.cx,
                    y: nextProps.cy,
                },
            };
        }
        if (dragging.toString() === 'false' && nextProps.dragging === 'true') {
            return {
                ...prevState,
                dragging: true,
            };
        }
        return null;

    }


    handlePointerDown = (e) => {
        const { position } = this.state;
        const { setDragging } = this.props;
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);

        this.setState({
            position: {
                ...position,
                active: true,
                offset: { x, y },
            },
        }, setDragging(true));
    }

    handlePointerMove = (e) => {
        const { position } = this.state;
        const { updatePoint } = this.props;

        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;

        el.setPointerCapture(e.pointerId);

        if (position.active) {
            const nx = position.x - (position.offset.x - x);
            const ny = position.y - (position.offset.y - y);
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
        const { setDragging } = this.props;
        this.setState({
            position: {
                ...position,
                active: false,
            },
        }, setDragging(false));
    };


    render() {
        const { position } = this.state;
        return (
            <circle
                {...this.props}
                cx={position.x}
                cy={position.y}
                ref={(node) => { this.node = node; }}
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
        // makeDraggable(this);
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
                ref={(node) => { this.node = node; }}
            />
        );
    }
}

export class AnnoShape extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: props.points,
            dragging: false,
        };
        this.types = ['rectangle', 'polygon', 'polyline', 'points'];
    }

    pointsStringToArray = (points) => {
        const pointsArray = points.split(' ').map((item) => {
            const pos = item.split(','); return { x: pos[0], y: pos[1] };
        });

        // console.log('pointsArray', pointsArray);
        return pointsArray;
    }

    testOnClick = (e) => {
        // console.log('handleonClick', e);
    }

    handleonDrage = (e) => {
        // console.log('handleonDrage', e);
    }

    setDragging = (flag) => {
        this.setState({ dragging: flag });
    }

    regularizeRect = (points, prePt, x, y) => {
        // tl:0, bl:1, br:2, tr:3
        const boundPoints = {
            tl: { x: +points[0].x, y: +points[0].y },
            bl: { x: +points[0].x, y: +points[1].y },
            br: { x: +points[1].x, y: +points[1].y },
            tr: { x: +points[1].x, y: +points[0].y },
        };

        let pid = null;
        if (prePt.x === boundPoints.tl.x && prePt.y === boundPoints.tl.y) {
            pid = 0;
        } else if (prePt.x === boundPoints.bl.x && prePt.y === boundPoints.bl.y) {
            pid = 1;
        } else if (prePt.x === boundPoints.br.x && prePt.y === boundPoints.br.y) {
            pid = 2;
        } else if (prePt.x === boundPoints.tr.x && prePt.y === boundPoints.tr.y) {
            pid = 3;
        }
        console.log('pid', pid);

        switch (pid) {
            case 0:
                boundPoints.tl = { x, y };
                break;
            case 1:
                boundPoints.bl = { x, y };
                boundPoints.tl = { ...boundPoints.tl, x };
                boundPoints.br = { ...boundPoints.br, y };
                break;
            case 2:
                boundPoints.br = { x, y };
                break;
            case 3:
                boundPoints.tr = { x, y };
                boundPoints.tl = { ...boundPoints.tl, y };
                boundPoints.br = { ...boundPoints.br, x };
                break;
            default:
                break;
        }

        const tl = { ...(boundPoints.tl) };
        const br = { ...(boundPoints.br) };
        // const { tl, br } = boundPoints;
        if (boundPoints.tl.x > boundPoints.br.x) {
            tl.x = Math.min(boundPoints.tl.x, boundPoints.br.x);
            br.x = Math.max(boundPoints.tl.x, boundPoints.br.x);
        }
        if (boundPoints.tl.y > boundPoints.br.y) {
            tl.y = Math.min(boundPoints.tl.y, boundPoints.br.y);
            br.y = Math.max(boundPoints.tl.y, boundPoints.br.y);
        }
        console.log([tl, br]);
        return [tl, br];
    }

    updateRectPoint = (x, y, prePt) => {
        const { shapeIndex, shapetype, updateObjPoint } = this.props;
        const { points } = this.state;
        console.log('updatePoint', prePt, x, y);

        let pointsArray = this.pointsStringToArray(points);
        let points_str = '';

        pointsArray = this.regularizeRect(pointsArray, prePt, x, y);
        points_str = pointsArray.map((item) => (`${item.x},${item.y}`)).join(' ');

        this.setState({ points: points_str },
            updateObjPoint(shapeIndex, points_str));
    }

    updatePolyPoint = (x, y, pid) => {
        const { shapeIndex, shapetype, updateObjPoint } = this.props;
        const { points } = this.state;
        console.log('updatePolyPoint', pid, x, y);
        let pointsArray = this.pointsStringToArray(points);
        let points_str = '';

        pointsArray[pid] = { x, y };
        points_str = pointsArray.map((item) => (`${item.x},${item.y}`)).join(' ');

        this.setState({ points: points_str },
            updateObjPoint(shapeIndex, points_str));
    }

    render() {
        const { shapetype } = this.props;
        const { points, dragging } = this.state;

        let content = '';
        const pointsArray = this.pointsStringToArray(points);
        switch (shapetype) {
            case 'rectangle':
                content = (
                    <>
                        <Rect
                            x={pointsArray[0].x}
                            y={pointsArray[0].y}
                            width={pointsArray[1].x - pointsArray[0].x}
                            height={pointsArray[1].y - pointsArray[0].y}
                        />
                        <g fill="white" stroke="green">
                            <Circle
                                onClick={(e) => { this.testOnClick(e); }}
                                updatePoint={this.updateRectPoint}
                                setDragging={this.setDragging}
                                dragging={dragging.toString()}
                                cx={pointsArray[0].x}
                                cy={pointsArray[0].y}
                                r="5"
                            />
                            <Circle
                                onClick={(e) => { this.testOnClick(e); }}
                                updatePoint={this.updateRectPoint}
                                setDragging={this.setDragging}
                                dragging={dragging.toString()}
                                cx={pointsArray[0].x}
                                cy={pointsArray[1].y}
                                r="5"
                            />
                            <Circle
                                onClick={(e) => { this.testOnClick(e); }}
                                updatePoint={this.updateRectPoint}
                                setDragging={this.setDragging}
                                dragging={dragging.toString()}
                                cx={pointsArray[1].x}
                                cy={pointsArray[1].y}
                                r="5"
                            />
                            <Circle
                                onClick={(e) => { this.testOnClick(e); }}
                                updatePoint={this.updateRectPoint}
                                setDragging={this.setDragging}
                                dragging={dragging.toString()}
                                cx={pointsArray[1].x}
                                cy={pointsArray[0].y}
                                r="5"
                            />
                        </g>
                    </>
                );
                break;
            case 'polygon':
                content = (
                    <>
                        <polygon
                            points={points}
                            fill="#ffcc00"
                            stroke="#ffcc00"
                            strokeWidth="2"
                            fillOpacity="0"
                            strokeOpacity="1"
                            zorder="9999999"
                        />
                        <g fill="white" stroke="green">
                            {pointsArray.map((pt, pid) => (
                                <Circle
                                    onClick={(e) => { this.testOnClick(e); }}
                                    updatePoint={(x, y) => { this.updatePolyPoint(x, y, pid); }}
                                    setDragging={this.setDragging}
                                    dragging={dragging.toString()}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="5"
                                />
                            ))}
                        </g>
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
    // currentImage: PropTypes.any.isRequired,
    // geometry: PropTypes.any.isRequired,
    // createNewObj: PropTypes.func.isRequired,
    // annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    // currentFrame: PropTypes.number.isRequired,
    points: PropTypes.string.isRequired,
    shapeIndex: PropTypes.number.isRequired,
    shapetype: PropTypes.string.isRequired,

};

const mapStateToProps = (state) => ({
    // annotations: state.annotations.annotations,
    // currentFrame: state.annotations.currentFrame,
});

export default connect(mapStateToProps, { updateObjPoint })(AnnoShape);
