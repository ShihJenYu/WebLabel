import React, { Component } from 'react';
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


export class Players extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="row justify-content-start" style={{ height: '49px', background: 'gainsboro' }}>
                <div className="col-auto p-0 m-0">
                    <IconButton aria-label="delete">
                        <FirstPageIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <ArrowBackRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <PlayArrowIcon />
                        {/* <Pause /> */}
                    </IconButton>
                    <IconButton aria-label="delete">
                        <NavigateNextIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <ArrowForwardRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <LastPageIcon />
                    </IconButton>
                </div>
                <div className="col p-0 m-0">
                    <input className="py-2" type="range" id="customRange1" style={{ marginTop: '6px', width: '100%' }} />
                </div>
            </div>
        );
    }
}

Players.propTypes = {
};

export default connect(null, {})(Players);
