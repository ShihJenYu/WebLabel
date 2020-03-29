import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { IconButton } from '@material-ui/core';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import LastPageIcon from '@material-ui/icons/LastPage';

// import {  } from '../../actions/annotations';


export class Players extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // currentFrame: 0,
            isplaying: false,
        };
    }

    currentFrameChange = (e) => {
        const { setCurrentFrame, frameStatus } = this.props;
        let val = +e.target.value - 1;
        if (val < 0) {
            val = 0;
        } else if (val >= frameStatus.length) {
            val = frameStatus.length - 1;
        }
        setCurrentFrame(val);
        // this.setState({ currentFrame: +e.target.value - 1 });
    }

    control_frame = (tag) => {
        const { setCurrentFrame, currentFrame, frameStatus } = this.props;

        if (tag === 'first') {
            setCurrentFrame(0);
        } else if (tag === 'last') {
            setCurrentFrame(frameStatus.length - 1);
            // this.setState({ currentFrame: frameStatus.length - 1 });
        } else {
            let newFrame = currentFrame;
            const val = +tag;
            if (currentFrame + val < 0) {
                newFrame = 0;
            } else if (currentFrame + val >= frameStatus.length) {
                newFrame = frameStatus.length - 1;
            } else {
                newFrame = currentFrame + val;
            }
            if (newFrame !== currentFrame) {
                console.log(tag, +tag);
                setCurrentFrame(newFrame);
                // this.setState({ currentFrame: newFrame });
            }
        }
    }

    play = (tag) => {
        const { isplaying } = this.state;
        const { frameStatus } = this.props;
        if (tag === 1 && this.playInterval == null) {
            this.playInterval = setInterval(() => {
                const { currentFrame, setCurrentFrame } = this.props;
                if (currentFrame >= frameStatus.length - 1) {
                    clearInterval(this.playInterval);
                    this.playInterval = null;
                    this.setState({ isplaying: false });
                } else {
                    setCurrentFrame(currentFrame + 1);
                    this.setState({ isplaying: true });
                }
            }, (1000 / 10));
        } else if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
            this.setState({ isplaying: false });
        }
    }

    render() {
        console.log('render palyer');
        const { frameStatus, currentFrame } = this.props;
        const { isplaying } = this.state;

        let playbutton = null;
        if (isplaying) {
            playbutton = (
                <IconButton aria-label="pause" onClick={() => { this.play(0); }}>
                    <PauseIcon />
                </IconButton>
            );
        } else {
            playbutton = (
                <IconButton aria-label="play" onClick={() => { this.play(1); }}>
                    <PlayArrowIcon />
                </IconButton>
            );
        }
        return (
            <div className="row justify-content-start align-items-center" style={{ height: '49px', background: 'gainsboro' }}>
                <div className="col-auto p-0 m-0">
                    <IconButton aria-label="first" onClick={() => { this.control_frame('first'); }}>
                        <FirstPageIcon />
                    </IconButton>
                    <IconButton aria-label="-10" onClick={() => { this.control_frame('-10'); }}>
                        <ArrowBackRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="-1" onClick={() => { this.control_frame('-1'); }}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    {playbutton}
                    <IconButton aria-label="+1" onClick={() => { this.control_frame('+1'); }}>
                        <NavigateNextIcon />
                    </IconButton>
                    <IconButton aria-label="+10" onClick={() => { this.control_frame('+10'); }}>
                        <ArrowForwardRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="last" onClick={() => { this.control_frame('last'); }}>
                        <LastPageIcon />
                    </IconButton>
                </div>
                <div className="col p-0 m-0">
                    <input
                        className="py-2"
                        type="range"
                        id="customRange1"
                        style={{ marginTop: '6px', width: '100%' }}
                        min={1}
                        value={currentFrame + 1}
                        max={frameStatus.length}
                        onChange={this.currentFrameChange}
                    />
                </div>
                <div className="col-auto p-0 m-0 ml-auto align-items-center">
                    <input
                        className="py-2"
                        type="number"
                        style={{ width: '70px', textAlign: 'center' }}
                        min={1}
                        value={currentFrame + 1}
                        max={frameStatus.length}
                        onChange={this.currentFrameChange}
                    />
                </div>
            </div>
        );
    }
}


Players.defaultProps = {
    frameStatus: [{}],
    currentFrame: 0,
};

Players.propTypes = {
    frameStatus: PropTypes.any,
    setCurrentFrame: PropTypes.func.isRequired,
    currentFrame: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
    // currentFrame: state.annotations.currentFrame,
});


export default connect(null, {})(Players);
