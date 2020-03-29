import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AnnoShape from './AnnoShape';

export class PlayerFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'none', // none , drawing
            points: [],
        };
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
        const { action, points } = this.state;
        if (action === 'drawing') {
            // console.log('testOnClick', e.target);
            // console.log('testOnClick', e.clientX, e.clientY);
            const pt = this.translateSVGPos(this.frameContent, e.clientX, e.clientY);
            // console.log('testOnClick', pt);
            // if (points.length > 1) {
            //     const last = points.pop();
            //     console.log('testOnClick', last);
            // }
            this.setState({ points: [...points, pt] });
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
        const { action, points } = this.state;
        const { createNewObj } = this.props;

        if (e.key === 'Q' || e.key === 'q') {
            console.log('Q press here! ');
            if (action === 'none') {
                this.setState({ action: 'drawing' });
            } else if (action === 'drawing') {
                const mousePt = points.pop();
                const points_str = this.pointsArrayToString(points);
                this.setState({ action: 'none', points: [] });
                createNewObj(points_str);
            }
        }
    }

    drawShapes = () => {
        const { currentFrame, annotations } = this.props;
        console.log(currentFrame, annotations);

        const shapes = [];
        annotations.forEach((obj, index) => {
            if (obj.frame === currentFrame) {
                shapes.push(
                    <AnnoShape
                        points={obj.points}
                        shapeIndex={index}
                        shapetype={obj.shapetype}
                    />,
                );
            }
        });
        console.log(shapes);

        return (shapes);
    }

    handleKeyDown = (e) => {
        if (e.key === 'Q' || e.key === 'q') {
            console.log('Q down here! ');
        }
    }

    render() {
        console.log('render palyerFrame');
        const { points } = this.state;
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
        console.log('points_str:', points_str);

        const shapes = this.drawShapes();

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
                    <polygon
                        points={points_str}
                        fill="#ffcc00"
                        stroke="#ffcc00"
                        strokeWidth="2"
                        fillOpacity="0"
                        strokeOpacity="1"
                        zorder="9999999"
                    />
                    {shapes}
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
    createNewObj: PropTypes.func.isRequired,
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    currentFrame: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
    currentFrame: state.annotations.currentFrame,
});

export default connect(mapStateToProps, {})(PlayerFrame);
