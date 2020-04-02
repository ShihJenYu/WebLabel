import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AnnoShape from './AnnoShape';

export class PlayerFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'none', // none , drawing
            shapeType: '',
            points: [],
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

    pointsArrayToString = (points) => {
        const points_str = points.map((item) => (`${item.x},${item.y}`)).join(' ');
        return points_str;
    }

    testOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { createNewObj } = this.props;
        const { action, points, shapeType } = this.state;
        if (action === 'drawing') {
            // console.log('testOnClick', e.target);
            // console.log('testOnClick', e.clientX, e.clientY);
            const pt = this.translateSVGPos(this.frameContent, e.clientX, e.clientY);
            // console.log('testOnClick', pt);
            // if (points.length > 1) {
            //     const last = points.pop();
            //     console.log('testOnClick', last);
            // }
            if (shapeType === 'rectangle' && points.length > 0) {
                const mousePt = points.pop();
                const points_str = this.pointsArrayToString([...points, pt]);
                this.setState({ action: 'none', points: [] });
                createNewObj(points_str, shapeType); // shapetype
            } else {
                this.setState({ points: [...points, pt] });

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
            if (points.length >= 1) {
                // console.log('handleMouseMove', e.target);
                // console.log('handleMouseMove', e.clientX, e.clientY);
                const pt = this.translateSVGPos(this.frameContent, e.clientX, e.clientY);
                // console.log('handleMouseMove', pt);
                if (points.length > 1) {
                    const mousePt = points.pop();
                }
                // console.log('handleMouseMove', last);
                this.setState({ points: [...points, pt] });
            }
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
        console.log('selectedShape', selectedShape);
        if (selectedShape.index !== null) {
            shapes.push(
                <AnnoShape
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

    render() {
        // console.log('render palyerFrame');
        const { points, shapeType } = this.state;
        const { currentImage, geometry } = this.props;

        const bg_img_src = (currentImage) ? currentImage.src : '';
        const bg_img_width = (currentImage) ? currentImage.width : 1;
        const bg_img_height = (currentImage) ? currentImage.height : 1;
        // if (geometry && this.playerFrameCell) {
        if (geometry) {
            geometry.width = this.playerFrameCell.clientWidth;
            geometry.height = this.playerFrameCell.clientHeight;
            geometry.scale = Math.min(geometry.width / bg_img_width, geometry.height / bg_img_height);
            geometry.left = (geometry.width - bg_img_width * geometry.scale) / 2;
            geometry.top = (geometry.height - bg_img_height * geometry.scale) / 2;
            // console.log('geometry.width', geometry.width, geometry.height);
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
                style={{ position: 'relative', height: '100%', width: '100%' }}
                onKeyPress={(e) => { this.handleKeyPress(e); }}
                onKeyDown={(e) => { this.handleKeyDown(e); }}
                onMouseMove={(e) => { this.handleMouseMove(e); }}
            >

                <svg
                    id="frameContent"
                    ref={(cell) => { this.frameContent = cell; }}
                    onClick={(e) => { this.testOnClick(e); }}
                    onContextMenu={(e) => { this.testOnContextMenu(e); }}


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
    geometry: PropTypes.any.isRequired,
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

export default connect(mapStateToProps, {})(PlayerFrame);
