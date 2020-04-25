import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AnnoShape from './AnnoShape';

import { selectObject } from '../../actions/annotations';

// ***************************************
// -1 if point is contained inside loop  *
// 0 if point is on the boundary of loop *
// 1 if point is outside loop ************
// ***************************************
const pointInClosedShape = require('robust-point-in-polygon');

// pints circle r="4"
const pointInPoints = (points, mousePos) => {
    const r = 4;
    const r2 = r ** 2;
    let pos = 1;
    for (let i = 0; i < points.length; i += 1) {
        const c = { x: points[i][0], y: points[i][1] };
        const d2 = (mousePos[0] - c.x) ** 2 + (mousePos[1] - c.y) ** 2;
        if (d2 > r2) pos = 1;
        else if (d2 === r2) return 0;
        else return -1;
    }
    return pos;
};

const distanceOfClosedShape = (points, mousePos) => {
    let minDistance = Number.MAX_SAFE_INTEGER;

    points.forEach((point, i, points) => {
        const p1 = { x: points[i][0], y: points[i][1] };
        const p2 = (i + 1 >= points.length)
            ? { x: points[0][0], y: points[0][1] }
            : { x: points[i + 1][0], y: points[i + 1][1] };

        // perpendicular from point to straight length
        const a_distance = (Math.abs((p2.y - p1.y) * mousePos[0]
            - (p2.x - p1.x) * mousePos[1] + p2.x * p1.y - p2.y * p1.x))
            / Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);

        // check if perpendicular belongs to the straight segment
        const a = (p1.x - mousePos[0]) ** 2 + (p1.y - mousePos[1]) ** 2;
        const b = (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
        const c = (p2.x - mousePos[0]) ** 2 + (p2.y - mousePos[1]) ** 2;
        if (a_distance < minDistance && (a + b - c) >= 0 && (c + b - a) >= 0) {
            minDistance = a_distance;
        }
    });
    return minDistance;
};

const distanceOfPoints = (points, mousePos) => {
    let minDistance = Number.MAX_SAFE_INTEGER;

    points.forEach((point) => {
        const a_distance = Math.sqrt((point[0] - mousePos[0]) ** 2 + (point[1] - mousePos[1]) ** 2);
        if (a_distance < minDistance) {
            minDistance = a_distance;
        }
    });
    return minDistance;
};

const distanceOfPolyline = (points, mousePos) => {
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < points.length - 1; i += 1) {
        const p1 = { x: points[i][0], y: points[i][1] };
        const p2 = { x: points[i + 1][0], y: points[i + 1][1] };

        // perpendicular from point to straight length
        const a_distance = (Math.abs((p2.y - p1.y) * mousePos[0]
            - (p2.x - p1.x) * mousePos[1] + p2.x * p1.y - p2.y * p1.x))
            / Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);

        // check if perpendicular belongs to the straight segment
        const a = (p1.x - mousePos[0]) ** 2 + (p1.y - mousePos[1]) ** 2;
        const b = (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
        const c = (p2.x - mousePos[0]) ** 2 + (p2.y - mousePos[1]) ** 2;
        if (a_distance < minDistance && (a + b - c) >= 0 && (c + b - a) >= 0) {
            minDistance = a_distance;
        }
    }
    return minDistance;
};


export class PlayerFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'none', // none , drawing
            moving: false,
            shapeType: '',
            points: [],
            geometry: {
                scale: 1,
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            },
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.shapeType !== prevState.shapeType) {
            return {
                ...prevState,
                shapeType: nextProps.shapeType,
                points: [],
            };
        }
        return null;
    }

    translateSVGPos = (svgCanvas, clientX, clientY) => {
        let pt = svgCanvas.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        pt = pt.matrixTransform(svgCanvas.getScreenCTM().inverse());

        const pos = {
            x: pt.x,
            y: pt.y,
        };
        return pos;
    }


    scale = (x, y, value) => {
        const { action, points, geometry } = this.state;

        const MAX_PLAYER_SCALE = 10;
        const MIN_PLAYER_SCALE = 0.1;

        const currentCenter = {
            x: (x - geometry.left) / geometry.scale,
            y: (y - geometry.top) / geometry.scale,
        };

        geometry.scale = value > 0 ? (geometry.scale * 6) / 5 : (geometry.scale * 5) / 6;
        geometry.scale = Math.min(geometry.scale, MAX_PLAYER_SCALE);
        geometry.scale = Math.max(geometry.scale, MIN_PLAYER_SCALE);

        const newCenter = {
            x: (x - geometry.left) / geometry.scale,
            y: (y - geometry.top) / geometry.scale,
        };

        geometry.left += (newCenter.x - currentCenter.x) * geometry.scale;
        geometry.top += (newCenter.y - currentCenter.y) * geometry.scale;

        this.setState({ geometry });
    }



    pointsArrayToString = (points) => {
        const points_str = points.map((item) => (`${item.x},${item.y}`)).join(' ');
        return points_str;
    }

    testOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { createNewObj, annotations, currentFrame, selectObject, selectedObject } = this.props;
        const { action, points, shapeType } = this.state;
        const pt = this.translateSVGPos(this.frameContent, e.clientX, e.clientY);

        if (action === 'drawing') {
            // console.log('testOnClick', e.target);
            // console.log('testOnClick', e.clientX, e.clientY);
            // console.log('testOnClick', pt);
            // if (points.length > 1) {
            //     const last = points.pop();
            //     console.log('testOnClick', last);
            // }
            if (shapeType === 'rectangle') {
                if (points.length > 0) {
                    const mousePt = points.pop();
                    const points_str = this.pointsArrayToString([...points, pt]);
                    this.setState({ action: 'none', points: [] });
                    createNewObj(points_str, shapeType); // shapetype
                } else {
                    this.setState({ points: [pt, pt] });
                }
            } else {
                if (points.length > 0) {
                    const mousePt = points.pop();
                }
                this.setState({ points: [...points, pt, pt] });
            }
        } else {
            console.log('onPlayerFrame onClick, will select closer object');
            console.log('mouse pos is:', pt);
            const closedShape = {
                minDistance: Number.MAX_SAFE_INTEGER,
                id: undefined,
            };
            const openShape = {
                minDistance: 4,
                id: undefined,
            };
            let finalSelectedShape;

            annotations.forEach((obj, index) => {
                if (obj.frame === currentFrame) {
                    const shape_pts = [];
                    (obj.points.split(' ')).forEach((pt_str) => {
                        const tmp_pt = pt_str.split(',');
                        shape_pts.push(tmp_pt.map((tmp) => +tmp));
                    });
                    if (obj.shapetype === 'rectangle') {
                        shape_pts.splice(1, 0, [shape_pts[0][0], shape_pts[1][1]]);
                        shape_pts.push([shape_pts[2][0], shape_pts[0][1]]);
                    }

                    // ***************************************
                    // -1 if point is contained inside loop  *
                    // 0 if point is on the boundary of loop *
                    // 1 if point is outside loop ************
                    // ***************************************
                    let inShape = 1;
                    let a_distance = Number.MAX_SAFE_INTEGER;
                    switch (obj.shapetype) {
                        case 'polygon': case 'rectangle': {
                            inShape = pointInClosedShape(shape_pts, [pt.x, pt.y]);
                            if (inShape !== 1) {
                                a_distance = distanceOfClosedShape(shape_pts, [pt.x, pt.y]);
                            }
                            if (a_distance < closedShape.minDistance) {
                                closedShape.minDistance = a_distance;
                                closedShape.id = obj.id;
                            }
                            break;
                        }
                        case 'polyline': {
                            // inShape = pointInPolyline(shape_pts, [pt.x, pt.y]);
                            // if (inShape !== 1) {
                            //     // a_distance = 0;
                            // }
                            a_distance = distanceOfPolyline(shape_pts, [pt.x, pt.y]);
                            if (a_distance < openShape.minDistance) {
                                openShape.minDistance = a_distance;
                                openShape.id = obj.id;
                            }
                            break;
                        }
                        case 'points': {
                            inShape = pointInPoints(shape_pts, [pt.x, pt.y]);
                            if (inShape !== 1) {
                                a_distance = distanceOfPoints(shape_pts, [pt.x, pt.y]);
                            }
                            if (a_distance < openShape.minDistance) {
                                openShape.minDistance = a_distance;
                                openShape.id = obj.id;
                            }
                            break;
                        }
                        default:
                            break;
                    }
                }
            });
            if (closedShape.id) {
                finalSelectedShape = closedShape.id;
            }
            if (openShape.id) {
                finalSelectedShape = openShape.id;
            }
            if (finalSelectedShape !== selectedObject.id) {
                selectObject(finalSelectedShape);
                console.log('selected id :', finalSelectedShape);
            } else {
                console.log('no change selected id :', finalSelectedShape);
            }
        }
    }

    testOnContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { action, points } = this.state;
        if (action === 'drawing') {
            // console.log('testOnClick', e.target);
            // console.log('testOnClick', e.clientX, e.clientY);
            const pt = this.translateSVGPos(this.frameContent, e.clientX, e.clientY);
            // console.log('testOnClick', pt);
            if (points.length > 0) {
                const mousePt = points.pop();
                const removePt = points.pop();
                if (points.length > 0) {
                    points.push(mousePt);
                }
                console.log('testOnContextMenu', points);
            }
            this.setState({ points });
        }
    }

    handleMouseMove = (e) => {
        const { action, points } = this.state;
        if (action === 'drawing') {
            if (points.length >= 2) {
                // console.log('handleMouseMove', e.target);
                // console.log('handleMouseMove', e.clientX, e.clientY);
                const pt = this.translateSVGPos(this.frameContent, e.clientX, e.clientY);
                // console.log('handleMouseMove', pt);
                // if (points.length >= 2) {

                // }
                const mousePt = points.pop();
                // console.log('handleMouseMove', last);
                this.setState({ points: [...points, pt] });
            }
        }
    }

    handleMouseWheel = (e) => {
        const { action, points } = this.state;
        // 34px is top header
        const x = e.nativeEvent.pageX; // - this._leftOffset;
        const y = e.nativeEvent.pageY - 34;

        if (e.nativeEvent.deltaY < 0) {
            this.scale(x, y, 1);
        } else {
            this.scale(x, y, -1);
        }
    }

    handleKeyPress = (e) => {
        const { action, points, shapeType } = this.state;
        const { createNewObj } = this.props;

        if (e.key === 'Q' || e.key === 'q') {
            console.log('Q press here! ');
            if (action === 'none') {
                this.setState({ action: 'drawing' });
            } else if (action === 'drawing') {
                const mousePt = points.pop();
                const points_str = this.pointsArrayToString(points);
                this.setState({ action: 'none', points: [] });
                if (shapeType === 'rectangle') {
                    if (points.length === 2) {
                        createNewObj(points_str, shapeType); // shapetype
                    }
                } else if (shapeType === 'polygon') {
                    if (points.length > 2) {
                        createNewObj(points_str, shapeType); // shapetype
                    }
                } else if (shapeType === 'polyline') {
                    if (points.length > 1) {
                        createNewObj(points_str, shapeType); // shapetype
                    }
                } else if (shapeType === 'points') {
                    if (points.length > 0) {
                        createNewObj(points_str, shapeType); // shapetype
                    }
                }
            }
        }
    }

    drawShapes = () => {
        const { currentFrame, annotations, selectedObject } = this.props;
        const { geometry } = this.state;
        // console.log(currentFrame, annotations);

        const shapes = [];
        const selectedShape = { index: null, obj: null };
        annotations.forEach((obj, index) => {
            if (obj.frame === currentFrame) {
                if (obj.id === selectedObject.id) {
                    selectedShape.index = index;
                    selectedShape.obj = obj;
                } else {
                    shapes.push(
                        <AnnoShape
                            objID={obj.id}
                            points={obj.points}
                            shapeIndex={index}
                            shapetype={obj.shapetype}
                            selected={false}
                        />,
                    );
                }
            }
        });
        // console.log('selectedShape', selectedShape);
        if (selectedShape.index !== null) {
            shapes.push(
                <AnnoShape
                    geometry={geometry}
                    objID={selectedShape.obj.id}
                    points={selectedShape.obj.points}
                    shapeIndex={selectedShape.index}
                    shapetype={selectedShape.obj.shapetype}
                    selected
                />,
            );
        }

        return (shapes);
    }

    handleKeyDown = (e) => {
        if (e.key === 'Q' || e.key === 'q') {
            console.log('Q down here! ');
        }
    }

    handlePointerDown = (e) => {
        const { moving, lastClickX, lastClickY } = this.state;
        // left: 0, middle: 1, right: 2
        if (e.button === 1 && e.altKey) {
            console.log('04/08 PointerDown', e.clientX, e.clientY);
            this.setState({
                moving: true,
                lastClickX: e.clientX,
                lastClickY: e.clientY,
            });
        }
    }

    handlePointerUp = (e) => {
        const { moving, lastClickX, lastClickY } = this.state;
        this.setState({
            moving: false,
        });
    }

    handlePointerMove = (e) => {
        const { moving, lastClickX, lastClickY } = this.state;
        // left: 0, middle: 1, right: 2
        if (moving) {
            const topOffset = e.clientY - lastClickY;
            const leftOffset = e.clientX - lastClickX;

            console.log('04/07 PointerMov,', e.clientX, e.clientY);
            this.move(e.clientX, e.clientY, topOffset, leftOffset);
        }
    }

    handleDoubleClick = (e) => {
        this.fit();
    }

    move = (lastClickX, lastClickY, topOffset, leftOffset) => {
        const { geometry } = this.state;
        geometry.top += topOffset;
        geometry.left += leftOffset;
        this.setState({
            geometry, lastClickX, lastClickY,
        });
    }

    fit = () => {
        const { geometry } = this.state;
        const { currentImage } = this.props;

        const bg_img_width = (currentImage) ? currentImage.width : 1;
        const bg_img_height = (currentImage) ? currentImage.height : 1;
        geometry.width = this.playerFrameCell.clientWidth;
        geometry.height = this.playerFrameCell.clientHeight;
        geometry.scale = Math.min(geometry.width / bg_img_width, geometry.height / bg_img_height);
        geometry.left = (geometry.width - bg_img_width * geometry.scale) / 2;
        geometry.top = (geometry.height - bg_img_height * geometry.scale) / 2;
        this.setState({ geometry });
    }

    render() {
        // console.log('render palyerFrame');
        const { points, shapeType, geometry } = this.state;
        const { currentImage } = this.props;

        const bg_img_src = (currentImage) ? currentImage.src : '';
        const bg_img_width = (currentImage) ? currentImage.width : 1;
        const bg_img_height = (currentImage) ? currentImage.height : 1;
        // console.log('04/07,', geometry);
        // if (geometry && this.playerFrameCell) {
        if (geometry && this.playerFrameCell && currentImage && (geometry.width !== this.playerFrameCell.clientWidth || geometry.height !== this.playerFrameCell.clientHeight)) {
            geometry.width = this.playerFrameCell.clientWidth;
            geometry.height = this.playerFrameCell.clientHeight;
            geometry.scale = Math.min(geometry.width / bg_img_width, geometry.height / bg_img_height);
            geometry.left = (geometry.width - bg_img_width * geometry.scale) / 2;
            geometry.top = (geometry.height - bg_img_height * geometry.scale) / 2;
            // console.log('geometry.width', geometry.width, geometry.height);
            this.setState({ geometry });
        }

        const geometryScale = (geometry) ? geometry.scale : 1;
        const geometryLeft = (geometry) ? geometry.left : 0;
        const geometryTop = (geometry) ? geometry.top : 0;

        let points_str = '';
        points_str = this.pointsArrayToString(points);
        // console.log('points_str:', points_str);

        const shapes = this.drawShapes();

        let drawingTemp = '';


        switch (shapeType) {
            case 'rectangle': {
                const shapeBox = {
                    xtl: Number.MAX_SAFE_INTEGER,
                    ytl: Number.MAX_SAFE_INTEGER,
                    xbr: Number.MIN_SAFE_INTEGER,
                    ybr: Number.MIN_SAFE_INTEGER,
                };
                points.forEach((point) => {
                    shapeBox.xtl = Math.min(shapeBox.xtl, point.x);
                    shapeBox.ytl = Math.min(shapeBox.ytl, point.y);
                    shapeBox.xbr = Math.max(shapeBox.xbr, point.x);
                    shapeBox.ybr = Math.max(shapeBox.ybr, point.y);
                });
                drawingTemp = (
                    <>
                        <rect
                            x={shapeBox.xtl}
                            y={shapeBox.ytl}
                            width={shapeBox.xbr - shapeBox.xtl}
                            height={shapeBox.ybr - shapeBox.ytl}
                            fill="#ffcc00"
                            stroke="#ffcc00"
                            strokeWidth="2"
                            fillOpacity="0"
                            strokeOpacity="1"
                            zorder="9999999"
                        />
                        <g fill="white" stroke="green">
                            {points.map((pt, pid) => (
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="2"
                                />
                            ))}
                        </g>
                    </>
                ); break;
            }
            case 'polygon':
                drawingTemp = (
                    <>
                        <polygon
                            points={points_str}
                            fill="#ffcc00"
                            stroke="#ffcc00"
                            strokeWidth="2"
                            fillOpacity="0"
                            strokeOpacity="1"
                            zorder="9999999"
                        />
                        <g fill="white" stroke="green">
                            {points.map((pt, pid) => (
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="2"
                                />
                            ))}
                        </g>
                    </>
                ); break;
            case 'polyline':
                drawingTemp = (
                    <>
                        <polyline
                            points={points_str}
                            fill="#ffcc00"
                            stroke="#ffcc00"
                            strokeWidth="2"
                            fillOpacity="0"
                            strokeOpacity="1"
                            zorder="9999999"
                        />
                        <g fill="white" stroke="green">
                            {points.map((pt, pid) => (
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="2"
                                />
                            ))}
                        </g>
                    </>
                ); break;
            case 'points':
                drawingTemp = (
                    <>
                        <g fill="white" stroke="green">
                            {points.map((pt, pid) => (
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="2"
                                />
                            ))}
                        </g>
                    </>
                ); break;
            default:
                break;
        }

        return (
            <div
                ref={(cell) => { this.playerFrameCell = cell; }}
                id="playerFrame"
                tabIndex="-1"
                style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}
                onKeyPress={this.handleKeyPress}
                onKeyDown={this.handleKeyDown}
                onMouseMove={this.handleMouseMove}
                onWheel={this.handleMouseWheel}
                onDoubleClick={this.handleDoubleClick}
            >

                <svg
                    id="frameContent"
                    ref={(cell) => { this.frameContent = cell; }}
                    onClick={this.testOnClick}
                    onContextMenu={this.testOnContextMenu}
                    onPointerDown={this.handlePointerDown}
                    onPointerUp={this.handlePointerUp}
                    onPointerMove={this.handlePointerMove}
                    onDoubleClick={(e) => { e.stopPropagation(); }}
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        MozTransformOrigin: 'top left',
                        WebkitTransformOrigin: 'top left',
                        width: bg_img_width,
                        height: bg_img_height,
                        left: geometryLeft,
                        top: geometryTop,
                        transform: `scale(${geometryScale})`,
                    }}
                >
                    {shapes}
                    {drawingTemp}

                </svg>
                <svg
                    id="frameBackground"
                    onDoubleClick={(e) => { e.stopPropagation(); }}
                    style={{
                        position: 'absolute',
                        zIndex: 0,
                        backgroundRepeat: 'no-repeat',
                        MozTransformOrigin: 'top left',
                        WebkitTransformOrigin: 'top left',
                        backgroundImage: `url(${bg_img_src})`,
                        width: bg_img_width,
                        height: bg_img_height,
                        left: geometryLeft,
                        top: geometryTop,
                        transform: `scale(${geometryScale})`,
                    }}
                />
            </div>
        );
    }
}

PlayerFrame.propTypes = {
    currentImage: PropTypes.any.isRequired,
    // geometry: PropTypes.any.isRequired,
    shapeType: PropTypes.string.isRequired,
    createNewObj: PropTypes.func.isRequired,
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    currentFrame: PropTypes.number.isRequired,
    selectedObject: PropTypes.object,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    currentFrame: state.annotations.currentFrame,
    selectedObject: state.annotations.selectedObject,

});

export default connect(mapStateToProps, { selectObject })(PlayerFrame);
