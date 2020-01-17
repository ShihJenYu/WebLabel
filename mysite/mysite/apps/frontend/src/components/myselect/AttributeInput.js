import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
// import {
//     fade,
//     ThemeProvider,
//     withStyles,
//     makeStyles,
//     createMuiTheme,
// } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';


import compose from 'recompose/compose';
import store from '../../store';


const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        minWidth: 140,
        maxWidth: 140,
        padding: '1px 5px 2px 5px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            // boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}))(InputBase);

export class AttributeInput extends Component {
    constructor(props) {
        super(props);
        this.state = { data: '', tipOpen: false };
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        console.log('componentDidUpdate in MultipleSelect');
        console.log(this.state);
    }

    handleEnter = (e) => {
        console.log('handleOpen2', e.target.value);
        this.setState({
            tipOpen: true,
        });
    }

    handleLeave = (e) => {
        console.log('handleOpen', e.target.value);
        this.setState({
            tipOpen: false,
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }


    render() {
        const { data, tipOpen } = this.state;
        const { params } = this.props;

        return (
            <div style={{ height: '24px' }}>
                <Tooltip title={data} arrow open={tipOpen}>
                    <BootstrapInput
                        inputProps={params}
                        onMouseEnter={this.handleEnter}
                        onMouseLeave={this.handleLeave}
                        onChange={this.onChange}
                        name="data"
                        value={data}
                    />
                </Tooltip>
            </div>

        );
    }
}

AttributeInput.defaultProps = {
    params: {},
};

AttributeInput.propTypes = {
    params: PropTypes.object,
};

export default connect(null, {})(AttributeInput);
